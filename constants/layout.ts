// The app is still phone-shaped content (a letter, a form, a shelf list) even when it's the
// full interactive webapp on a wide desktop browser, not just a mobile view. Centering a
// narrow column reads better than stretching every card edge-to-edge, and it keeps the web
// and native layouts visually consistent. Spread webContainer into a screen's outermost
// container style.
export const WEB_MAX_WIDTH = 480;

export const webContainer = {
  width: '100%' as const,
  maxWidth: WEB_MAX_WIDTH,
  alignSelf: 'center' as const,
};
