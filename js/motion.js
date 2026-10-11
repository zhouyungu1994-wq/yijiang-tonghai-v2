// All positions use a 1000 × 562.5 design grid (scaled to 1920 × 1080).
export const clamp = p => Math.max(0, Math.min(1, p));
export const smooth = p => { p = clamp(p); return p*p*(3-2*p); };
export const lerp = (a,b,p) => a+(b-a)*p;

// Follow the shore roads around the tea canopy, then descend to the stone steps.
export const cargoRoutes = [
  [[249,487],[311,445],[333,403],[325,352],[346,318],[397,282],[568,278],[698,250],[771,273],[799,306],[817,341],[839,377]],
  [[406,517],[449,470],[368,433],[349,381],[338,337],[375,295],[545,279],[682,250],[762,269],[793,300],[816,337],[839,377]],
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
    height:lerp(39,85,clamp((point.y-234)/283)),
    alpha:smooth(p/.04)*(1-smooth((p-.95)/.05)),
    p};
}
