// All positions use a 1000 × 562.5 design grid, scaled with the painting.
export const clamp = p => Math.max(0, Math.min(1, p));
export const smooth = p => { p = clamp(p); return p*p*(3-2*p); };
export const lerp = (a,b,p) => a+(b-a)*p;

// Two workers leave the dock, pick up goods in the open market, then return.
// The third worker keeps the earlier short stone-step route.
export const cargoRoutes = [
  [[830,379],[803,388],[775,402],[750,431],[713,467],[628,474],[535,469],[445,458],[371,442],[332,420],[326,397]],
  [[833,391],[805,399],[777,416],[746,452],[702,481],[625,486],[540,479],[456,467],[397,453],[373,433],[371,414]],
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
    height:lerp(36,75,clamp((point.y-234)/283)),
    alpha:smooth(p/.04)*(1-smooth((p-.95)/.05)),
    p};
}
