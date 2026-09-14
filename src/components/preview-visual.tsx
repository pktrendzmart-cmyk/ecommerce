export function PreviewVisual({index,name}:{index:number;name:string}){
  return <div role="img" aria-label={name} className="preview-visual" style={{backgroundPosition:`${index*100/3}% center`}}/>;
}
