/**
 * Vortex — ported from the UI Vault. Same layered radial-gradient glow (blue top-left, violet
 * bottom-right) plus three slow-drifting colour wells and a faint masked grid. No blur filters,
 * so it stays cheap to composite.
 */
export function Vortex() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_34%)]" />
      <div className="fx-anim animate-drift-a absolute -left-[12%] top-[4%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.13),transparent)] will-change-transform" />
      <div className="fx-anim animate-drift-b absolute left-[48%] top-[26%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)] will-change-transform" />
      <div className="fx-anim animate-drift-c absolute left-[6%] top-[56%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(232,121,249,0.11),transparent)] will-change-transform" />
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
    </div>
  )
}
