// All positions use a 1000 × 562.5 design grid, scaled with the painting.
export const clamp = p => Math.max(0, Math.min(1, p));
export const smooth = p => { p = clamp(p); return p*p*(3-2*p); };
export const lerp = (a,b,p) => a+(b-a)*p;

// Two workers enter from the lower-left path, take goods in the market, then return.
// The third worker keeps the earlier short stone-step route.
export const cargoRoutes = [
  [[249,444],[263,432],[283,414],[303,394],[327,374],[350,359]],
  [[264,453],[278,436],[298,414],[322,395],[350,381],[375,367]],
  [[846,234],[824,260],[803,282],[793,304],[810,329],[828,355],[841,381]]
];
export function routePoint(points, progress) {
  const lengths = points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[1]-points[i][1]));
  let distance = clamp(progress)*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++) {
    if(distance<=lengths[i] || i===lengths.length-1) {
      const p=clamp(distance/lengths[i]);
      return {x:lerp(points[i][0],points[i+1][0],p),y:lerp(points[i][1],points[i+1][1],p),dx:points[i+1][0]-points[i][0]};
    }
    distance-=lengths[i];
  }
}
export function cargoPose(progress,index) {
  const p=clamp((progress-index*.045)/.90);
  const returning=p>.53;
  const travel=p<.44?p/.44:p<.53?1:1-(p-.53)/.47;
  const point=routePoint(cargoRoutes[index],travel);
  return {...point,returning,picking:p>=.44&&p<=.53,
    pickup:clamp((p-.44)/.09),
    height:index<2?lerp(39,56,clamp((point.y-234)/283)):lerp(36,75,clamp((point.y-234)/283)),
    alpha:index<2?smooth(p/.12)*(1-smooth((p-.84)/.16)):smooth(p/.04)*(1-smooth((p-.95)/.05)),
    p};
}

// From the middle of the pier, porters visit the cargo on each ship and return.
export const portRoutes = [
  [[438,382],[403,383],[366,384],[330,385],[295,385]],
  [[454,387],[485,387],[521,388],[557,388]],
  [[435,397],[400,397],[363,398],[328,398]],
  [[454,401],[489,401],[524,402],[557,402]]
];
export function portPose(progress,index) {
  const p=clamp((progress-index*.06)/.82);
  const returning=p>.56;
  const travel=p<.45?p/.45:p<.56?1:1-(p-.56)/.44;
  const point=routePoint(portRoutes[index],travel);
  return {...point,returning,picking:p>=.45&&p<=.56,
    alpha:smooth(p/.04)*(1-smooth((p-.94)/.06)),p};
}
