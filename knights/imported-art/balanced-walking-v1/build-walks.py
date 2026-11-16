"""Redraw balanced legs beneath the existing upper-body pose.
Usage: python3 build-walks.py GAME.html OUTPUT_DIRECTORY
Offline artwork tool, never part of the server/browser runtime.
"""
import base64, io, json, math, re, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

# Hip height and left/right leg joint coordinates on the game's 144x112 cell.
# Each tuple: left hip/knee/ankle, right hip/knee/ankle. Armour below the ankle
# follows the foot as one rigid piece, instead of stretching a whole image.
RIGS={
 'worker':(88,75,79,88,69,101,94,76,96,89,101,100),
 'fire':(86,74,78,86,73,97,91,75,95,86,101,97),
 'leafcutter':(80,76,73,88,65,100,87,76,91,89,95,99),
 'army':(81,76,69,90,60,103,89,76,99,91,108,103),
 'wingedant':(84,75,77,88,70,104,91,75,98,90,97,103),
 'bullet':(87,70,80,81,75,96,93,70,98,83,104,95),
 'killer':(83,76,78,91,73,108,89,76,97,93,104,108),
 'forager':(77,71,66,84,59,98,84,72,87,84,91,98),
 'carpenter':(75,77,66,87,61,99,83,77,88,89,95,99),
 'bumble':(84,78,78,91,76,101,91,78,97,90,101,101),
 'honeybee':(84,75,75,88,66,99,91,75,97,88,106,99),
 'ladybug':(85,75,76,88,68,100,93,75,99,88,107,100),
 'rhino':(86,75,80,89,76,101,95,75,102,89,109,101),
 'bombardier':(86,75,79,88,69,100,94,75,99,88,104,100),
 'stag':(78,76,73,89,71,101,85,76,91,88,103,101),
 'dung':(83,76,82,89,81,99,90,76,95,89,99,99),
 'monarch':(82,76,80,90,77,104,89,76,93,91,94,105),
 'morpho':(87,75,81,89,78,101,94,75,98,89,104,101),
 'swallowtail':(90,72,81,85,77,101,97,72,101,84,107,99),
 'hawkmoth':(83,77,74,91,72,103,90,77,99,89,106,104),
 'atlas':(88,80,83,91,77,103,95,80,101,91,99,104),
 'camel':(76,79,74,92,75,104,83,79,87,92,90,104),
 'katydid':(77,80,74,93,73,104,84,80,91,92,95,104),
 'mole':(87,78,86,92,88,103,94,78,94,91,96,103),
 'field':(77,76,72,89,67,101,84,76,88,89,95,101),
 'weta':(75,75,70,88,66,101,83,75,92,88,105,101),
 'fruitfly':(88,76,80,89,72,101,95,76,102,90,111,102),
 'horsefly':(82,77,78,90,74,103,89,77,95,90,100,103),
 'botfly':(80,76,73,91,63,104,88,76,94,91,101,104),
 'housefly':(78,77,74,91,70,104,85,77,92,91,99,104),
 'robberfly':(78,77,72,90,66,103,85,77,91,90,97,103),
 'pseudo':(86,77,85,90,84,102,94,77,96,90,99,103),
 'bark':(84,79,76,91,70,104,92,79,98,91,102,104),
 'vinegaroon':(87,74,83,88,80,101,95,74,100,88,103,101),
 'deathstalker':(77,75,74,89,71,101,85,75,92,89,98,101),
 'emperor':(78,77,71,90,63,102,86,77,94,90,103,102),
 'alate':(80,77,71,91,66,104,87,77,95,90,98,104),
 'nasute':(82,76,76,91,71,104,90,76,101,91,112,104),
 'kamikaze':(82,78,79,91,76,103,90,78,94,91,98,103),
 'major':(80,77,77,90,73,103,87,77,95,90,100,103),
 'tworker':(80,78,72,91,66,105,87,78,93,91,97,105),
}

def triangle(src, source, target):
    # PIL's inverse affine map, alpha-clipped to one triangle.
    a=np.array([[x,y,1] for x,y in target],dtype=float)
    try: coeff=np.linalg.solve(a,np.array(source,dtype=float)).T.flatten()
    except np.linalg.LinAlgError:return Image.new('RGBA',src.size)
    warped=src.transform(src.size,Image.Transform.AFFINE,tuple(coeff),Image.Resampling.BICUBIC)
    mask=Image.new('L',src.size);ImageDraw.Draw(mask).polygon(target,fill=255)
    warped.putalpha(Image.fromarray(np.minimum(np.array(warped.getchannel('A')),np.array(mask))))
    return warped

def segment(src,a,b,ta,tb,width):
    def quad(p,q,w):
        dx=q[0]-p[0];dy=q[1]-p[1];l=math.hypot(dx,dy);nx=-dy/l*w;ny=dx/l*w
        return [(p[0]+nx,p[1]+ny),(p[0]-nx,p[1]-ny),(q[0]-nx,q[1]-ny),(q[0]+nx,q[1]+ny)]
    sq=quad(a,b,width);tq=quad(ta,tb,width)
    out=triangle(src,[sq[i] for i in [0,1,2]],[tq[i] for i in [0,1,2]])
    out.alpha_composite(triangle(src,[sq[i] for i in [0,2,3]],[tq[i] for i in [0,2,3]]))
    return out

def foot(p):
    p%=1
    if p<.5:return (1-4*p)*11,0
    t=(p-.5)*2
    return -11+22*t,-7*math.sin(math.pi*t)

def build(src,rig):
    src=src.crop((0,0,144,112)).convert('RGBA')
    # Remove only faint cell dividers and disconnected ground-line residue.
    a=np.array(src);a[a[:,:,3]<65]=0
    src=Image.fromarray(a)
    joints=[];mask=Image.new('L',src.size);md=ImageDraw.Draw(mask)
    for off in (0,6):
        hip=rig[off:off+2];knee=rig[off+2:off+4];ankle=rig[off+4:off+6];joints.append((hip,knee,ankle))
        md.line([hip,knee,ankle],fill=255,width=18);md.ellipse((ankle[0]-11,ankle[1]-6,ankle[0]+12,ankle[1]+7),fill=255)
    hip_y=min(rig[1],rig[7])
    md.rectangle((min(rig[4],rig[10],rig[0],rig[6])-13,hip_y+1,max(rig[4],rig[10],rig[0],rig[6])+14,112),fill=255)
    torso=src.copy();torso.putalpha(Image.fromarray(np.where(np.array(mask)>0,0,np.array(src.getchannel('A'))).astype('uint8')))
    baseline=max(rig[5],rig[11]);centre=(rig[0]+rig[6])/2
    # Anchor both hip joints to visible pelvis pixels, not empty transparent
    # coordinates in the draft poses. Preserve weapons outside the leg region.
    row=a[max(0,hip_y-3):hip_y+1,:,3].max(axis=0)
    xs=np.where((row>150)&(np.arange(144)>centre-18)&(np.arange(144)<centre+12))[0]
    if len(xs):centre=float(np.median(xs))
    joints=[((centre-3,hip_y-2),joints[0][1],joints[0][2]),((centre+3,hip_y-2),joints[1][1],joints[1][2])]
    # Knock out the horizontal ground stroke, not the boots.
    arr=np.array(torso)
    for y in range(max(0,baseline+3),112):arr[y,:,:]=0
    torso=Image.fromarray(arr)
    # Remove detached boot fragments left outside the draft's rigged legs.
    from scipy.ndimage import label
    arr=np.array(torso);labels,count=label(arr[:,:,3]>0)
    for component in range(1,count+1):
        ys,xs=np.where(labels==component)
        if len(ys)<120 and ys.min()>hip_y:arr[labels==component]=0
    torso=Image.fromarray(arr)
    # Solid redrawn articulated armour avoids gaps when a narrow source leg
    # cannot cover a bent knee. Palette comes from the existing character.
    pixels=np.array(src)
    colors=pixels[:hip_y,:,:3][pixels[:hip_y,:,3]>180]
    saturation=colors.max(axis=1).astype(int)-colors.min(axis=1).astype(int)
    candidates=colors[(saturation>24)&(colors.max(axis=1)>55)&(colors.max(axis=1)<210)]
    armor=tuple(np.median(candidates,axis=0).astype(int)) if len(candidates) else (91,83,84)
    ink=tuple(np.percentile(colors,8,axis=0).astype(int));bone=tuple(np.percentile(colors,88,axis=0).astype(int))
    out=Image.new('RGBA',(144*8,112))
    for i in range(8):
        canvas=Image.new('RGBA',src.size)
        for n,(hip,knee,ankle) in enumerate(joints):
            dx,dy=foot(i/8+n*.5)
            target=(centre+dx,baseline+dy)
            mid=((hip[0]+target[0])/2+3*math.sin(math.pi*((i/8+n*.5)%1)*2)**2,(hip[1]+target[1])/2-2 if dy<0 else (hip[1]+target[1])/2)
            # Render at 3x for clean cel-shaded edges at the original game size.
            limb=Image.new('RGBA',(432,336));ld=ImageDraw.Draw(limb)
            pts=[tuple(v*3 for v in p) for p in [hip,mid,target]]
            ld.line(pts,fill=ink,width=21,joint='curve')
            ld.line(pts,fill=armor,width=14,joint='curve')
            for p in pts[:2]:
                x,y=p;ld.ellipse((x-9,y-9,x+9,y+9),fill=ink);ld.ellipse((x-5,y-5,x+5,y+5),fill=bone)
            x,y=pts[-1]
            ld.polygon([(x-8,y-6),(x+8,y-6),(x+15,y+5),(x+15,y+10),(x-10,y+10)],fill=ink)
            ld.line([(x-5,y-5),(x+6,y-5)],fill=armor,width=5)
            canvas.alpha_composite(limb.resize(src.size,Image.Resampling.LANCZOS))
        canvas.alpha_composite(torso)
        out.paste(canvas,(i*144,0))
    return out

if __name__=='__main__':
    game=Path(sys.argv[1]).read_text();dest=Path(sys.argv[2]);dest.mkdir(parents=True,exist_ok=True)
    raw=re.search(r'const ANIM_PNG=(.*?);\s*\n',game).group(1)
    items=re.findall(r'(\w+):\{y:(\d+),h:(\d+),u:"([^"]+)"',raw)
    assert len(items)==41 and set(k for k,*_ in items)==set(RIGS)
    manifest={}
    for key,y,h,url in items:
        src=Image.open(io.BytesIO(base64.b64decode(url.split(',')[1])))
        build(src,RIGS[key]).save(dest/(key+'.png'))
        manifest[key]={'y':int(y),'h':int(h),'frames':8,'cellWidth':144,'cellHeight':112,'file':key+'.png'}
    (dest/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Built',len(manifest),'balanced-stride sheets')