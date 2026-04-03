/**
 * Editorial Brain v11
 *
 * Text reflows around the tracer (Pretext obstacle) AND glows near it.
 * The tracer creates a moving bubble of space in the text while
 * illuminating surrounding lines. Center identity floats naturally.
 */

import {
  prepareWithSegments,
  layoutNextLine,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

const BODY_TEXT = `I believe that every right implies a responsibility, every opportunity an obligation, every possession a duty. If you want to succeed you should strike out on new paths rather than travel the worn paths of accepted success. I build instruments for seeing inside the living brain. Not because it is easy but because what you cannot measure you cannot understand. The secret to success is to do the common thing uncommonly well. I chase photons through bone and tissue, simulate light scattering in neonatal skulls, and try always to see a little more clearly. Do not be afraid to give up the good to go for the great. The work demands patience. A photon is launched, scattered, absorbed, or lost. The inverse problem is ill-posed. The reconstruction converges slowly. But every iteration brings the image closer to truth. I do not think there is any other quality so essential to success of any kind as the quality of perseverance. It overcomes almost everything, even nature. I was not born with a silver spoon but I was born with something far better: an unshakeable will to work. Starting from scratch is a privilege not a punishment. Neuroengineering is not a discipline it is a conviction that computation can illuminate what the eye cannot reach. Near-infrared light enters the skull and what returns carries the signature of blood and thought. The man who starts simply to make money never makes much. Start with purpose. I came to build tools that give clinicians sight where before there was darkness. Every setback is a setup for a comeback. I always tried to turn every disaster into an opportunity. I have debugged code at three in the morning, rewritten pipelines that refused to converge, stared at loss curves that plateaued for days. The reward is the moment the hemodynamic map resolves and cortical activation appears where before there was only noise. Your future is created by what you do today not tomorrow. The most common way people give up their power is by thinking they do not have any. I believe in the compound interest of small daily effort. In the elegance of a well-written simulation. In the quiet satisfaction of a model that generalizes. Sow a thought, reap an action. Sow an action, reap a habit. Sow a habit, reap a character. Sow a character, reap a destiny. I believe in the dignity of labor whether with head or hand. That there is nothing in this world that is worth having or worth doing unless it means effort and difficulty. I study the physics of light in tissue. I train neural networks on synthetic brains. I run jobs on GPU clusters at dawn and read the logs before coffee. This is not ambition. This is devotion. Good fortune is what happens when opportunity meets with preparation. Building at the frontier of what light can reveal about the mind. I build for the infants who cannot hold still in a scanner. I build for the clinicians who need answers in real time. I build because the brain is the last frontier and I refuse to look away. The only question with wealth is what you do with it. The only question with knowledge is who you serve with it. Every success requires a sacrifice. I have made mine gladly.`;

// ---------------------------------------------------------------------------
// Brain SVG path -- traced from anatomical reference via potrace
// This is the FULL smooth bezier path. Used with Path2D for drawing.
// Coords are in a 980x980 viewport (potrace output space).
// ---------------------------------------------------------------------------

// Outer contour with all gyri detail (smooth bezier curves)
const BRAIN_SVG_OUTER = "M464.50,209.00 C456.20,209.90,445.10,212.40,441.50,214.20 C440.40,214.80,438.50,216.10,437.40,217.20 C435.20,219.10,435.10,219.10,424.40,216.40 C404.00,211.10,378.80,213.20,350.80,222.40 C331.90,228.60,318.40,236.90,313.10,245.60 C311.20,248.80,309.90,249.90,308.00,250.00 C304.10,250.00,296.00,252.40,291.00,255.00 C282.00,259.50,277.10,263.70,255.80,285.10 C238.90,302.00,233.50,308.10,231.20,312.70 C227.40,320.20,225.90,327.30,227.00,332.80 C227.50,335.80,227.40,337.30,226.60,337.60 C226.00,337.80,223.50,338.70,221.10,339.50 C214.80,341.70,208.80,346.60,204.70,353.00 C202.80,356.00,197.00,366.70,191.90,376.70 C182.90,394.20,182.50,395.30,182.40,401.70 C182.30,407.50,181.70,409.70,178.50,416.00 C169.90,433.10,167.40,446.90,170.40,461.00 C172.60,471.40,175.70,477.00,185.50,488.30 C193.50,497.50,194.00,498.40,194.00,502.70 C194.00,508.60,196.60,526.30,199.00,536.50 C204.70,560.90,216.90,585.80,230.40,600.80 C241.70,613.10,260.50,625.40,275.50,630.00 C290.60,634.60,309.90,636.10,326.90,634.00 C331.50,633.40,335.50,633.20,335.80,633.50 C336.80,634.40,330.40,664.70,326.60,677.20 C324.60,683.60,321.20,693.20,318.90,698.40 C314.40,709.00,314.60,711.00,320.10,711.00 C326.10,711.00,332.30,715.10,344.60,727.50 C355.80,738.80,361.50,743.00,365.30,743.00 C366.20,743.00,368.80,739.30,371.60,734.30 C389.30,701.70,408.00,679.00,434.00,658.50 C455.20,641.80,466.50,628.60,470.10,616.40 C471.30,612.40,471.70,612.00,474.00,612.40 C475.40,612.70,490.20,613.00,507.00,613.20 L537.50,613.50 L544.00,610.40 C547.60,608.60,553.00,606.70,556.00,606.00 C565.30,603.90,582.30,595.20,598.90,584.20 C615.50,573.10,624.10,556.60,621.10,541.70 C619.70,535.10,615.40,528.30,606.10,518.00 C602.60,514.10,600.00,510.70,600.20,510.50 C600.40,510.30,604.40,510.00,609.20,509.80 L617.80,509.50 L633.10,517.00 L648.40,524.50 L667.90,524.80 C678.70,525.00,691.10,525.20,695.50,525.20 C702.60,525.40,708.70,524.60,728.00,520.80 C742.50,518.10,757.80,509.60,771.40,496.90 C779.20,489.60,789.60,476.70,793.00,470.10 C795.70,464.70,798.80,454.40,799.50,448.00 C799.90,444.90,801.80,439.30,803.90,435.10 C807.30,428.00,807.50,427.10,807.50,417.60 C807.50,408.40,807.20,407.00,804.50,401.60 C802.60,397.70,799.40,393.80,795.30,390.10 L789.00,384.50 L789.00,374.50 C789.00,357.30,784.40,345.40,773.30,334.30 C768.50,329.50,764.70,326.90,756.10,322.70 C745.20,317.30,745.00,317.10,740.00,309.70 C729.60,294.10,712.10,281.90,688.20,273.60 C674.70,268.90,674.90,269.00,664.40,259.10 C649.10,244.40,635.90,239.10,615.30,239.00 C606.10,239.00,605.10,238.80,604.50,237.10 C603.00,232.30,587.40,222.90,573.00,218.10 C560.30,214.00,543.90,213.50,531.60,216.80 C529.50,217.40,525.90,216.80,519.00,214.90 C500.50,209.70,479.80,207.50,464.50,209.00 Z";

// Full traced SVG (all subpaths including internal detail)
const BRAIN_SVG_FULL = `${BRAIN_SVG_OUTER}`;
// Note: internal detail comes from the full potrace trace loaded at runtime

// Brain bounds in the 980x980 space
const BRAIN_BOUNDS = { minX: 167, minY: 207, maxX: 808, maxY: 743 };

// Tracer path: 151 evenly-spaced points sampled from the smooth bezier outline.
// Tracers follow this exact path, matching the visible SVG curves.
const BRAIN_POLYGON: [number, number][] = [
  [0.4605, 0.0043], [0.4416, 0.0084], [0.4243, 0.0165], [0.4016, 0.0175],
  [0.3855, 0.0138], [0.3654, 0.0122], [0.3439, 0.0135], [0.3245, 0.0169],
  [0.3042, 0.0225], [0.2828, 0.0303], [0.2646, 0.0390], [0.2467, 0.0506],
  [0.2320, 0.0654], [0.2174, 0.0804], [0.1966, 0.0878], [0.1815, 0.0980],
  [0.1653, 0.1143], [0.1503, 0.1317], [0.1343, 0.1508], [0.1204, 0.1677],
  [0.1090, 0.1826], [0.0970, 0.2055], [0.0931, 0.2282], [0.0866, 0.2463],
  [0.0678, 0.2595], [0.0570, 0.2759], [0.0463, 0.2995], [0.0358, 0.3236],
  [0.0279, 0.3430], [0.0239, 0.3675], [0.0179, 0.3899], [0.0105, 0.4099],
  [0.0046, 0.4358], [0.0035, 0.4567], [0.0068, 0.4812], [0.0150, 0.5034],
  [0.0289, 0.5248], [0.0402, 0.5417], [0.0431, 0.5662], [0.0460, 0.5909],
  [0.0499, 0.6147], [0.0552, 0.6375], [0.0619, 0.6599], [0.0713, 0.6847],
  [0.0804, 0.7044], [0.0920, 0.7247], [0.1052, 0.7423], [0.1224, 0.7595],
  [0.1389, 0.7725], [0.1558, 0.7830], [0.1750, 0.7911], [0.1968, 0.7962],
  [0.2166, 0.7982], [0.2365, 0.7980], [0.2573, 0.7957], [0.2618, 0.8111],
  [0.2572, 0.8380], [0.2535, 0.8572], [0.2481, 0.8806], [0.2414, 0.9036],
  [0.2331, 0.9288], [0.2426, 0.9407], [0.2607, 0.9528], [0.2771, 0.9711],
  [0.2909, 0.9869], [0.3064, 0.9994], [0.3192, 0.9838], [0.3294, 0.9622],
  [0.3417, 0.9390], [0.3526, 0.9205], [0.3659, 0.9004], [0.3780, 0.8842],
  [0.3930, 0.8664], [0.4092, 0.8494], [0.4234, 0.8358], [0.4385, 0.8201],
  [0.4530, 0.8027], [0.4663, 0.7813], [0.4739, 0.7601], [0.4923, 0.7571],
  [0.5116, 0.7575], [0.5336, 0.7579], [0.5526, 0.7581], [0.5748, 0.7584],
  [0.5945, 0.7493], [0.6128, 0.7424], [0.6303, 0.7337], [0.6482, 0.7225],
  [0.6673, 0.7088], [0.6826, 0.6959], [0.6966, 0.6781], [0.7067, 0.6550],
  [0.7092, 0.6312], [0.7029, 0.6079], [0.6908, 0.5881], [0.6793, 0.5723],
  [0.6932, 0.5648], [0.7122, 0.5696], [0.7301, 0.5801], [0.7480, 0.5906],
  [0.7679, 0.5927], [0.7893, 0.5931], [0.8085, 0.5935], [0.8286, 0.5937],
  [0.8488, 0.5913], [0.8698, 0.5867], [0.8889, 0.5812], [0.9082, 0.5710],
  [0.9245, 0.5589], [0.9403, 0.5437], [0.9543, 0.5267], [0.9676, 0.5073],
  [0.9778, 0.4879], [0.9843, 0.4647], [0.9892, 0.4384], [0.9965, 0.4181],
  [0.9992, 0.3929], [0.9970, 0.3696], [0.9853, 0.3476], [0.9704, 0.3312],
  [0.9703, 0.3082], [0.9681, 0.2846], [0.9609, 0.2611], [0.9503, 0.2432],
  [0.9347, 0.2263], [0.9144, 0.2131], [0.8996, 0.2010], [0.8873, 0.1810],
  [0.8733, 0.1639], [0.8562, 0.1487], [0.8392, 0.1372], [0.8200, 0.1272],
  [0.8021, 0.1196], [0.7846, 0.1068], [0.7681, 0.0887], [0.7526, 0.0753],
  [0.7339, 0.0653], [0.7161, 0.0609], [0.6922, 0.0596], [0.6780, 0.0491],
  [0.6624, 0.0362], [0.6409, 0.0240], [0.6241, 0.0177], [0.6042, 0.0145],
  [0.5842, 0.0150], [0.5618, 0.0183], [0.5427, 0.0127], [0.5229, 0.0076],
  [0.5031, 0.0043], [0.4842, 0.0029], [0.4641, 0.0037],
];

const INTERNAL_LINES: [number, number][][] = [];

// ---------------------------------------------------------------------------
// Arc utils
// ---------------------------------------------------------------------------

function computeArcLengths(pts: [number, number][]): number[] {
  const lengths = [0];
  for (let i = 1; i <= pts.length; i++) {
    const prev = pts[i - 1]!, curr = pts[i % pts.length]!;
    const dx = curr[0] - prev[0], dy = curr[1] - prev[1];
    lengths.push(lengths[lengths.length - 1]! + Math.sqrt(dx * dx + dy * dy));
  }
  return lengths;
}

function pointAtArc(pts: [number, number][], arcs: number[], dist: number): [number, number] {
  const total = arcs[arcs.length - 1]!;
  const d = ((dist % total) + total) % total;
  let lo = 0, hi = arcs.length - 1;
  while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (arcs[mid]! < d) lo = mid; else hi = mid; }
  const f = arcs[hi]! - arcs[lo]! > 0 ? (d - arcs[lo]!) / (arcs[hi]! - arcs[lo]!) : 0;
  const p1 = pts[lo % pts.length]!, p2 = pts[hi % pts.length]!;
  return [p1[0] + (p2[0] - p1[0]) * f, p1[1] + (p2[1] - p1[1]) * f];
}

// ---------------------------------------------------------------------------
// Obstacle helpers
// ---------------------------------------------------------------------------

interface Interval { left: number; right: number; }

function circleInterval(cx: number, cy: number, r: number, bandTop: number, bandBot: number): Interval | null {
  if (cy + r < bandTop || cy - r > bandBot) return null;
  // Widest point of circle in this band
  const dEdge = Math.min(Math.abs(cy - bandTop), Math.abs(cy - bandBot));
  const dCenter = Math.abs(cy - (bandTop + bandBot) / 2);
  const d = (cy >= bandTop && cy <= bandBot) ? 0 : Math.min(dEdge);
  if (d >= r) return null;
  const hw = Math.sqrt(r * r - d * d);
  return { left: cx - hw, right: cx + hw };
}

/** Elliptical obstacle for the center block -- organic, not boxy */
function ellipseInterval(
  cx: number, cy: number, rx: number, ry: number,
  bandTop: number, bandBot: number
): Interval | null {
  // Ellipse: (x-cx)^2/rx^2 + (y-cy)^2/ry^2 = 1
  // For a horizontal band, find the x extent of the ellipse
  const bandMid = (bandTop + bandBot) / 2;
  const dy = bandMid - cy;
  if (Math.abs(dy) >= ry) return null;
  // Half-width at this y: rx * sqrt(1 - (dy/ry)^2)
  const hw = rx * Math.sqrt(1 - (dy * dy) / (ry * ry));
  return { left: cx - hw, right: cx + hw };
}

function carveSlots(left: number, right: number, blocked: Interval[]): Interval[] {
  if (!blocked.length) return [{ left, right }];
  const sorted = blocked.slice().sort((a, b) => a.left - b.left);
  const slots: Interval[] = [];
  let cursor = left;
  for (const b of sorted) {
    if (b.left > cursor) slots.push({ left: cursor, right: Math.min(b.left, right) });
    cursor = Math.max(cursor, b.right);
  }
  if (cursor < right) slots.push({ left: cursor, right });
  return slots.filter(s => s.right - s.left > 35);
}

// ---------------------------------------------------------------------------
// Line data
// ---------------------------------------------------------------------------

interface TextLine {
  x: number; y: number; width: number; text: string; el: HTMLSpanElement;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export class EditorialBrain {
  private container: HTMLElement;
  private stage: HTMLDivElement;
  private brainCanvas: HTMLCanvasElement;
  private brainCtx: CanvasRenderingContext2D;
  private textLines: TextLine[] = [];

  private preparedBody: PreparedTextWithSegments;
  private pageWidth: number;
  private pageHeight: number;

  private brainPixelPts: [number, number][] = [];
  private brainArcs: number[] = [];
  private brainTotal = 0;

  private animId = 0;
  private prevLineTexts: string[] = [];
  private startTime = 0;

  private centerX: number;
  private centerY: number;
  private centerW = 380;
  private centerH = 160;

  private readonly BODY_FONT = '19px "Iowan Old Style", Georgia, "Palatino Linotype", Palatino, serif';
  private readonly LINE_HEIGHT = 31;
  private readonly MARGIN = 40;
  private readonly TEXT_TOP = 28;
  private readonly OBSTACLE_R = 16;
  private readonly SPOTLIGHT_R = 160;
  private readonly CENTER_FADE_R = 220;
  private readonly CURSOR_COLOR: readonly [number, number, number] = [210, 195, 150];
  private readonly CURSOR_SPOTLIGHT_R = 140;
  private readonly TRACERS = [
    { speed: 45,  offset: 0,                    trailLen: 0.16, color: [196, 163, 90] as const,  name: "amber" },   // warm gold
    { speed: -30, offset: 0.45,                  trailLen: 0.20, color: [90, 160, 145] as const,  name: "teal" },    // cool teal
    { speed: 22,  offset: 0.72,                  trailLen: 0.14, color: [140, 160, 190] as const, name: "silver" },  // cool silver-blue
  ];

  private isMobile: boolean;
  private touchTimeout = 0;

  constructor(container: HTMLElement, mobile = false) {
    this.container = container;
    this.isMobile = mobile;
    this.pageWidth = container.clientWidth;
    this.pageHeight = container.clientHeight;

    if (mobile) {
      this.centerW = Math.min(280, this.pageWidth - 40);
      this.centerH = 140;
    }
    this.centerX = (this.pageWidth - this.centerW) / 2;
    this.centerY = mobile
      ? this.pageHeight * 0.52 // below brain on mobile
      : (this.pageHeight - this.centerH) / 2 - 15;

    // Map polygon points using the SAME transform as the SVG Path2D drawing
    const m = 40, bw = this.pageWidth - m * 2, bh = this.pageHeight - m * 2;
    const bb = BRAIN_BOUNDS;
    const brainW = bb.maxX - bb.minX;
    const brainH = bb.maxY - bb.minY;
    const sx = bw / brainW;
    const sy = bh / brainH;
    const brainScale = Math.min(sx, sy);
    const offsetX = m + (bw - brainW * brainScale) / 2;
    const offsetY = m + (bh - brainH * brainScale) / 2;
    // Polygon is normalized 0..1 within BRAIN_BOUNDS, so map back to SVG coords then to screen
    this.brainPixelPts = BRAIN_POLYGON.map(([nx, ny]) => [
      offsetX + nx * brainW * brainScale,
      offsetY + ny * brainH * brainScale,
    ] as [number, number]);
    this.brainArcs = computeArcLengths(this.brainPixelPts);
    this.brainTotal = this.brainArcs[this.brainArcs.length - 1]!;

    this.stage = document.createElement("div");
    this.stage.className = "editorial-stage";
    this.stage.style.width = this.pageWidth + "px";
    this.stage.style.height = this.pageHeight + "px";
    container.appendChild(this.stage);

    // Brain canvas
    this.brainCanvas = document.createElement("canvas");
    this.brainCanvas.width = this.pageWidth * devicePixelRatio;
    this.brainCanvas.height = this.pageHeight * devicePixelRatio;
    this.brainCanvas.style.width = this.pageWidth + "px";
    this.brainCanvas.style.height = this.pageHeight + "px";
    this.brainCanvas.className = "brain-overlay";
    this.stage.appendChild(this.brainCanvas);
    this.brainCtx = this.brainCanvas.getContext("2d")!;
    this.brainCtx.scale(devicePixelRatio, devicePixelRatio);

    // Center identity -- no background, just text
    const center = document.createElement("div");
    center.className = "identity-block";
    center.style.left = this.centerX + "px";
    center.style.top = this.centerY + "px";
    center.style.width = this.centerW + "px";
    center.innerHTML = `
      <p class="id-tagline">building at the frontier of light and thought</p>
      <h1 class="id-name">Amit Subhash</h1>
      <p class="id-fields">Neuroengineering &middot; Optics &middot; ML</p>
      <p class="id-affiliation">Indiana University &middot; Incoming PhD</p>
      <nav class="id-links">
        <a href="https://github.com/AmitSubhash" target="_blank">GitHub</a>
        <a href="https://www.linkedin.com/in/amitsubhash/" target="_blank">LinkedIn</a>
        <a href="mailto:atsubhas@iu.edu">Email</a>
      </nav>
    `;
    this.stage.appendChild(center);

    // Click name to reveal tagline
    const nameEl = center.querySelector(".id-name") as HTMLElement;
    const tagEl = center.querySelector(".id-tagline") as HTMLElement;
    if (nameEl && tagEl) {
      nameEl.style.cursor = "none";
      nameEl.addEventListener("click", () => {
        tagEl.classList.toggle("visible");
      });
    }

    // Repeat text enough to fill the page (roughly 3x should do)
    const repeatedText = BODY_TEXT + " " + BODY_TEXT + " " + BODY_TEXT;
    this.preparedBody = prepareWithSegments(repeatedText, this.BODY_FONT);

    // Mouse/touch tracking
    if (!this.isMobile) {
      this.stage.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = this.container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });
      this.stage.addEventListener("mouseleave", () => {
        this.mouseX = -9999;
        this.mouseY = -9999;
      });
    } else {
      // Mobile: tap to place temporary light
      this.stage.addEventListener("touchstart", (e: TouchEvent) => {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = this.container.getBoundingClientRect();
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;
        // Fade out after 2s
        clearTimeout(this.touchTimeout);
        this.touchTimeout = window.setTimeout(() => {
          this.mouseX = -9999;
          this.mouseY = -9999;
        }, 2000);
      }, { passive: true });
      this.stage.addEventListener("touchmove", (e: TouchEvent) => {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = this.container.getBoundingClientRect();
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;
      }, { passive: true });
      this.stage.addEventListener("touchend", () => {
        clearTimeout(this.touchTimeout);
        this.touchTimeout = window.setTimeout(() => {
          this.mouseX = -9999;
          this.mouseY = -9999;
        }, 2000);
      });
    }
  }

  private mouseX = -9999;
  private mouseY = -9999;

  private getTracerPositions(t: number): { x: number; y: number; color: readonly [number, number, number] }[] {
    return this.TRACERS.map(tr => {
      const dist = t * tr.speed + tr.offset * this.brainTotal;
      const [x, y] = pointAtArc(this.brainPixelPts, this.brainArcs, dist);
      return { x, y, color: tr.color };
    });
  }

  // -----------------------------------------------------------------------
  // Layout text each frame (reflows around tracer + center block)
  // -----------------------------------------------------------------------

  private layoutText(tracers: { x: number; y: number }[]): void {
    const regionLeft = this.MARGIN;
    const regionRight = this.pageWidth - this.MARGIN;
    const lh = this.LINE_HEIGHT;
    let lineTop = this.TEXT_TOP;
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    const maxY = this.pageHeight - 20;
    let lineIdx = 0;

    while (lineTop + lh <= maxY) {
      const blocked: Interval[] = [];

      // Center block as elliptical obstacle (organic, not boxy)
      const ecx = this.centerX + this.centerW / 2;
      const ecy = this.centerY + this.centerH / 2;
      const erx = this.centerW / 2 + 10; // horizontal radius
      const ery = this.centerH / 2 + 8;  // vertical radius -- tight
      const ei = ellipseInterval(ecx, ecy, erx, ery, lineTop, lineTop + lh);
      if (ei) blocked.push(ei);

      // All tracer obstacles
      for (const tr of tracers) {
        const ci = circleInterval(tr.x, tr.y, this.OBSTACLE_R, lineTop, lineTop + lh);
        if (ci) blocked.push(ci);
      }

      const slots = carveSlots(regionLeft, regionRight, blocked);
      if (!slots.length) { lineTop += lh; continue; }

      for (const slot of slots) {
        const line = layoutNextLine(this.preparedBody, cursor, slot.right - slot.left);
        if (!line) break;

        const x = Math.round(slot.left);
        const y = Math.round(lineTop);

        if (lineIdx < this.textLines.length) {
          // Reuse existing element
          const tl = this.textLines[lineIdx]!;
          if (this.prevLineTexts[lineIdx] !== line.text) {
            tl.el.textContent = line.text;
          }
          tl.el.style.left = x + "px";
          tl.el.style.top = y + "px";
          tl.x = x; tl.y = y; tl.width = line.width; tl.text = line.text;
        } else {
          // Create new element
          const el = document.createElement("span");
          el.className = "ed-line";
          el.textContent = line.text;
          el.style.left = x + "px";
          el.style.top = y + "px";
          el.style.font = this.BODY_FONT;
          el.style.lineHeight = lh + "px";
          this.stage.appendChild(el);
          this.textLines.push({ x, y, width: line.width, text: line.text, el });
        }

        lineIdx++;
        cursor = line.end;
      }
      lineTop += lh;
    }

    // Remove excess lines
    while (this.textLines.length > lineIdx) {
      this.textLines.pop()!.el.remove();
    }

    this.prevLineTexts = this.textLines.map(l => l.text);
  }

  // -----------------------------------------------------------------------
  // Spotlight: CSS mask per line
  // -----------------------------------------------------------------------

  private updateSpotlight(tracers: { x: number; y: number; color: readonly [number, number, number]; radius?: number }[]): void {
    const defaultR = this.SPOTLIGHT_R;
    const lh = this.LINE_HEIGHT;

    for (const line of this.textLines) {
      const lx = line.x;
      const ly = line.y;
      const lineY = ly + lh / 2;

      let bestSmooth = 0;
      let bestMx = 0;
      let bestMy = 0;
      let blendR = 0, blendG = 0, blendB = 0, totalWeight = 0;

      for (const tr of tracers) {
        const R = tr.radius ?? defaultR;
        const clampedX = Math.max(lx, Math.min(lx + line.width, tr.x));
        const dx = tr.x - clampedX;
        const dy = tr.y - lineY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > R) continue;

        const factor = 1 - dist / R;
        const smooth = factor * factor;

        // Blend colors weighted by influence
        blendR += tr.color[0] * smooth;
        blendG += tr.color[1] * smooth;
        blendB += tr.color[2] * smooth;
        totalWeight += smooth;

        if (smooth > bestSmooth) {
          bestSmooth = smooth;
          bestMx = tr.x - lx;
          bestMy = tr.y - ly;
        }
      }

      // Fade text near the center identity block
      const ecx = this.centerX + this.centerW / 2;
      const ecy = this.centerY + this.centerH / 2;
      const lineCx = lx + line.width / 2;
      const lineCy = ly + lh / 2;
      const distToCenter = Math.sqrt((lineCx - ecx) ** 2 + (lineCy - ecy) ** 2);
      const fadeR = this.CENTER_FADE_R;
      if (distToCenter < fadeR) {
        const fadeFactor = distToCenter / fadeR; // 0 at center, 1 at edge
        const dampen = fadeFactor * fadeFactor; // quadratic -- aggressive fade near center
        bestSmooth *= dampen;
        totalWeight *= dampen;
        blendR *= dampen;
        blendG *= dampen;
        blendB *= dampen;
      }

      if (bestSmooth < 0.003) {
        line.el.style.opacity = "0.012";
        line.el.style.mask = "none";
        line.el.style.webkitMask = "none";
        line.el.style.color = "";
        line.el.style.fontWeight = "300";
        continue;
      }

      // Build composite mask from all tracers
      // Use the strongest one for the main mask shape, but layer multiple gradients
      const maskParts: string[] = [];
      for (const tr of tracers) {
        const trR = tr.radius ?? defaultR;
        const clampedX = Math.max(lx, Math.min(lx + line.width, tr.x));
        const dx = tr.x - clampedX;
        const dy = tr.y - lineY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > trR) continue;

        const factor = 1 - dist / trR;
        const smooth = factor * factor;
        const mx = tr.x - lx;
        const my = tr.y - ly;
        const mr = trR * 0.85;
        const peakAlpha = Math.min(1, smooth * 1.5 + 0.02);
        const edgeAlpha = Math.min(0.5, smooth * 0.5);
        maskParts.push(
          `radial-gradient(ellipse ${mr}px ${mr * 0.7}px at ${mx}px ${my}px, rgba(0,0,0,${peakAlpha.toFixed(3)}) 0%, rgba(0,0,0,${edgeAlpha.toFixed(3)}) 55%, transparent 100%)`
        );
      }

      // Composite masks -- CSS mask supports multiple layers with add
      // We use the mask-composite to combine them
      const maskStr = maskParts.join(", ");
      line.el.style.mask = maskStr;
      line.el.style.webkitMask = maskStr;
      if (maskParts.length > 1) {
        line.el.style.maskComposite = "add";
        (line.el.style as any).webkitMaskComposite = "source-over";
      } else {
        line.el.style.maskComposite = "";
        (line.el.style as any).webkitMaskComposite = "";
      }
      line.el.style.opacity = "1";

      // Blended color from all tracers
      if (totalWeight > 0) {
        const cr = Math.round(blendR / totalWeight);
        const cg = Math.round(blendG / totalWeight);
        const cb = Math.round(blendB / totalWeight);
        const cf = Math.min(1, bestSmooth * 1.3);
        const r = Math.round(cr + (240 - cr) * cf * 0.5);
        const g = Math.round(cg + (235 - cg) * cf * 0.5);
        const b = Math.round(cb + (230 - cb) * cf * 0.5);
        line.el.style.color = `rgb(${r}, ${g}, ${b})`;

        // Font weight: 300 (ghost) -> 500 (lit)
        const weight = Math.round(300 + bestSmooth * 200);
        line.el.style.fontWeight = String(weight);
      } else {
        line.el.style.fontWeight = "300";
      }
    }
  }

  // -----------------------------------------------------------------------
  // Draw brain + tracer
  // -----------------------------------------------------------------------

  private drawBrain(t: number): void {
    const ctx = this.brainCtx;
    ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
    const pts = this.brainPixelPts;

    const elapsed = t - this.startTime;

    // Scale SVG path to fit the page
    const m = 40;
    const bw = this.pageWidth - m * 2;
    const bh = this.pageHeight - m * 2;
    const bb = BRAIN_BOUNDS;
    const svgSx = bw / (bb.maxX - bb.minX);
    const svgSy = bh / (bb.maxY - bb.minY);
    const scale = Math.min(svgSx, svgSy);
    const offsetX = m + (bw - (bb.maxX - bb.minX) * scale) / 2;
    const offsetY = m + (bh - (bb.maxY - bb.minY) * scale) / 2;
    const svgPath = new Path2D(BRAIN_SVG_OUTER);

    // Estimated total path length in SVG space (~2000 units)
    const pathLen = 2000;

    // Phase 1 (0-4s): stroke-draw animation -- brain draws itself
    // Phase 2 (4-6s): fade from drawn to periodic pulse
    // Phase 3 (6s+): periodic pulse
    const DRAW_DURATION = 4;
    const FADE_DURATION = 2;

    // Periodic pulse (always computed, blended in after intro)
    const pulseT = t * 0.125;
    const pulseRaw = Math.sin(pulseT * Math.PI * 2);
    const pulse = pulseRaw > 0 ? pulseRaw * pulseRaw : 0;
    const pulseAlpha = 0.04 + pulse * 0.18;

    ctx.save();
    ctx.translate(offsetX - bb.minX * scale, offsetY - bb.minY * scale);
    ctx.scale(scale, scale);

    if (elapsed < DRAW_DURATION + FADE_DURATION) {
      if (elapsed < DRAW_DURATION) {
        // Stroke-draw: use lineDash to progressively reveal
        const progress = elapsed / DRAW_DURATION;
        // Ease out for smooth deceleration
        const eased = 1 - (1 - progress) * (1 - progress);
        const drawn = eased * pathLen;

        ctx.setLineDash([drawn, pathLen]);
        ctx.lineDashOffset = 0;
        ctx.strokeStyle = `rgba(74, 124, 111, 0.28)`;
        ctx.lineWidth = 1.5 / scale;
        ctx.stroke(svgPath);
        ctx.setLineDash([]);
      } else {
        // Fade from full to periodic
        const fadeProgress = (elapsed - DRAW_DURATION) / FADE_DURATION;
        const introAlpha = 0.28 * (1 - fadeProgress);
        const blended = Math.max(pulseAlpha, introAlpha);
        ctx.strokeStyle = `rgba(74, 124, 111, ${blended.toFixed(3)})`;
        ctx.lineWidth = (0.7 + pulse * 0.8) / scale;
        ctx.stroke(svgPath);
      }
    } else {
      // Normal periodic pulse
      ctx.strokeStyle = `rgba(74, 124, 111, ${pulseAlpha.toFixed(3)})`;
      ctx.lineWidth = (0.7 + pulse * 0.8) / scale;
      ctx.stroke(svgPath);
    }

    ctx.restore();

    // Glow the brain outline near cursor and tracers
    // Draw bright segments of the polygon path near each light source
    const glowRadius = 150;
    const lightSources: { x: number; y: number; color: readonly [number, number, number]; r?: number }[] = [];
    // Add tracers
    for (const trDef of this.TRACERS) {
      const headDist = t * trDef.speed + trDef.offset * this.brainTotal;
      const [hx, hy] = pointAtArc(pts, this.brainArcs, headDist);
      lightSources.push({ x: hx, y: hy, color: trDef.color });
    }
    // Add cursor
    if (this.mouseX > 0 && this.mouseY > 0) {
      lightSources.push({ x: this.mouseX, y: this.mouseY, color: this.CURSOR_COLOR, r: 180 });
    }

    // For each segment of the polygon, check proximity to light sources and draw brighter
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i]!;
      const p2 = pts[(i + 1) % pts.length]!;
      const mx = (p1[0] + p2[0]) / 2;
      const my = (p1[1] + p2[1]) / 2;

      let bestGlow = 0;
      let glowR = 0, glowG = 0, glowB = 0;

      for (const ls of lightSources) {
        const r = ls.r ?? glowRadius;
        const dx = mx - ls.x, dy = my - ls.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r) {
          const f = 1 - dist / r;
          const glow = f * f * 0.4;
          if (glow > bestGlow) {
            bestGlow = glow;
            glowR = ls.color[0]; glowG = ls.color[1]; glowB = ls.color[2];
          }
        }
      }

      if (bestGlow > 0.01) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.strokeStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${bestGlow.toFixed(3)})`;
        ctx.lineWidth = 1.5 + bestGlow * 3;
        ctx.stroke();
      }
    }

    // Draw each tracer
    for (const trDef of this.TRACERS) {
      const headDist = t * trDef.speed + trDef.offset * this.brainTotal;
      const trailLen = this.brainTotal * trDef.trailLen;
      const [cr, cg, cb] = trDef.color;
      const head = pointAtArc(pts, this.brainArcs, headDist);

      // Trail
      const segs = 45;
      for (let i = 0; i < segs; i++) {
        const frac = i / segs;
        const d1 = headDist - trailLen * (1 - frac);
        const d2 = headDist - trailLen * (1 - (i + 1) / segs);
        const p1 = pointAtArc(pts, this.brainArcs, d1);
        const p2 = pointAtArc(pts, this.brainArcs, d2);
        const ease = frac * frac * frac;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${(ease * 0.4).toFixed(3)})`;
        ctx.lineWidth = 0.4 + ease * 2;
        ctx.stroke();
      }

      // Outer glow
      const g3 = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 30);
      g3.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.10)`);
      g3.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = g3;
      ctx.beginPath(); ctx.arc(head[0], head[1], 30, 0, Math.PI * 2); ctx.fill();

      // Mid glow
      const g2 = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 12);
      g2.addColorStop(0, `rgba(${Math.min(255, cr + 40)}, ${Math.min(255, cg + 40)}, ${Math.min(255, cb + 40)}, 0.20)`);
      g2.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
      g2.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(head[0], head[1], 12, 0, Math.PI * 2); ctx.fill();

      // Core dot
      ctx.beginPath(); ctx.arc(head[0], head[1], 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(255, cr + 60)}, ${Math.min(255, cg + 60)}, ${Math.min(255, cb + 60)}, 0.65)`;
      ctx.fill();

      // Bright center
      ctx.beginPath(); ctx.arc(head[0], head[1], 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(255, cr + 80)}, ${Math.min(255, cg + 80)}, ${Math.min(255, cb + 80)}, 0.85)`;
      ctx.fill();

      // Ambient spotlight
      const gs = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], this.SPOTLIGHT_R * 0.7);
      gs.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.04)`);
      gs.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.015)`);
      gs.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = gs;
      ctx.beginPath(); ctx.arc(head[0], head[1], this.SPOTLIGHT_R * 0.7, 0, Math.PI * 2); ctx.fill();
    }
  }

  // -----------------------------------------------------------------------
  // Loop
  // -----------------------------------------------------------------------

  start(): void {
    this.startTime = performance.now() / 1000;
    const loop = (now: number): void => {
      const t = now / 1000;
      const tracers = this.getTracerPositions(t);
      const mouseActive = this.mouseX > 0 && this.mouseY > 0;

      // Cursor is a full tracer -- pushes text AND illuminates
      const obstacles = [...tracers];
      const allLights: { x: number; y: number; color: readonly [number, number, number]; radius?: number }[] = [...tracers];
      if (mouseActive) {
        // Check if near IU affiliation line -- use crimson color
        const ecx = this.centerX + this.centerW / 2;
        const iuY = this.centerY + this.centerH * 0.62;
        const nearIU = Math.abs(this.mouseY - iuY) < 25 && Math.abs(this.mouseX - ecx) < this.centerW * 0.6;
        const cursorColor: readonly [number, number, number] = nearIU ? [180, 20, 20] : this.CURSOR_COLOR;

        obstacles.push({ x: this.mouseX, y: this.mouseY, color: cursorColor });
        allLights.push({ x: this.mouseX, y: this.mouseY, color: cursorColor, radius: this.CURSOR_SPOTLIGHT_R });
      }

      this.layoutText(obstacles);
      this.updateSpotlight(allLights);
      this.drawBrain(t);

      // Draw cursor tracer dot
      if (mouseActive) {
        const ctx = this.brainCtx;

        // Check proximity to center identity block
        const ecx = this.centerX + this.centerW / 2;
        const ecy = this.centerY + this.centerH / 2;
        const dxC = this.mouseX - ecx;
        const dyC = this.mouseY - ecy;
        const distCenter = Math.sqrt(dxC * dxC + dyC * dyC);
        const centerProximity = Math.max(0, 1 - distCenter / 200); // 0 far, 1 close

        // Check if near the IU affiliation line (roughly centerY + 100..120)
        const iuY = this.centerY + this.centerH * 0.62;
        const nearIU = Math.abs(this.mouseY - iuY) < 25 && Math.abs(this.mouseX - ecx) < this.centerW * 0.6;

        // Color: default warm gold, turns red near IU, fades near center
        let cr: number, cg: number, cb: number;
        if (nearIU) {
          cr = 180; cg = 20; cb = 20; // IU crimson
        } else {
          [cr, cg, cb] = this.CURSOR_COLOR;
        }

        // Fade opacity when close to center block
        const fadeAlpha = 1 - centerProximity * 0.8;

        if (fadeAlpha > 0.05) {
          // Outer glow
          const g3 = ctx.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, 28);
          g3.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${(0.09 * fadeAlpha).toFixed(3)})`);
          g3.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = g3;
          ctx.beginPath(); ctx.arc(this.mouseX, this.mouseY, 28, 0, Math.PI * 2); ctx.fill();

          // Mid glow
          const g2 = ctx.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, 10);
          g2.addColorStop(0, `rgba(${Math.min(255, cr + 30)}, ${Math.min(255, cg + 30)}, ${Math.min(255, cb + 30)}, ${(0.18 * fadeAlpha).toFixed(3)})`);
          g2.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${(0.05 * fadeAlpha).toFixed(3)})`);
          g2.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = g2;
          ctx.beginPath(); ctx.arc(this.mouseX, this.mouseY, 10, 0, Math.PI * 2); ctx.fill();

          // Core dot
          ctx.beginPath(); ctx.arc(this.mouseX, this.mouseY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, cr + 40)}, ${Math.min(255, cg + 40)}, ${Math.min(255, cb + 40)}, ${(0.6 * fadeAlpha).toFixed(3)})`;
          ctx.fill();

          // Bright center
          ctx.beginPath(); ctx.arc(this.mouseX, this.mouseY, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, cr + 60)}, ${Math.min(255, cg + 60)}, ${Math.min(255, cb + 60)}, ${(0.8 * fadeAlpha).toFixed(3)})`;
          ctx.fill();
        }
      }

      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.animId);
    clearTimeout(this.touchTimeout);
  }
}
