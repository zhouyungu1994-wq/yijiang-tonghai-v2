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

// Every foot position follows the sloping wooden deck; the return points are spread out.
export const portRoutes = [
  [[450,380],[430,377],[402,373],[375,370]],
  [[465,382],[494,386],[526,391],[558,394]],
  [[480,384],[455,381],[426,377],[400,374]],
  [[495,386],[520,389],[546,393],[570,396]]
];
export const portReturnRoutes = [
  [[375,370],[394,389],[413,404],[432,414]],
  [[558,394],[531,401],[498,414],[464,422]],
  [[400,374],[431,393],[465,413],[496,430]],
  [[570,396],[557,405],[542,421],[528,438]]
];
export function portPose(progress,index) {
  const p=clamp((progress-index*.06)/.82);
  const returning=p>.56;
  const travel=returning?(p-.56)/.44:p<.45?p/.45:1;
  const point=routePoint(returning?portReturnRoutes[index]:portRoutes[index],travel);
  return {...point,returning,picking:p>=.45&&p<=.56,
    alpha:smooth(p/.04),p};
}
