// All positions use a 1000 × 562.5 design grid, scaled with the painting.
export const clamp = p => Math.max(0, Math.min(1, p));
export const smooth = p => { p = clamp(p); return p*p*(3-2*p); };
export const lerp = (a,b,p) => a+(b-a)*p;

// Two workers enter from the lower-left path, take goods in the market, then return.
// The third worker keeps the earlier short stone-step route.
export const cargoRoutes = [
  [[165,452],[206,453],[241,445],[271,428],[299,407],[328,389],[349,379]],
  [[184,472],[222,464],[256,449],[285,428],[314,416],[350,408],[376,396]],
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

// From the middle of the pier, porters visit the cargo on each ship and return.
export const portRoutes = [
  [[443,383],[410,386],[377,389],[345,392],[314,396]],
  [[456,389],[493,394],[522,400],[551,405]],
  [[434,397],[402,399],[368,400],[336,402]],
  [[466,398],[503,405],[536,410],[565,411]]
];
export function portPose(progress,index) {
  const p=clamp((progress-index*.06)/.82);
  const returning=p>.56;
  const travel=p<.45?p/.45:p<.56?1:1-(p-.56)/.44;
  const point=routePoint(portRoutes[index],travel);
  return {...point,returning,picking:p>=.45&&p<=.56,
    alpha:smooth(p/.04)*(1-smooth((p-.94)/.06)),p};
}
