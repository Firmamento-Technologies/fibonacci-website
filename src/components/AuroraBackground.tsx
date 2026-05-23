// Aurora gradient mesh - 3 blob colorati blurrati animati lentamente.
// Aria-hidden perche' puramente decorativo. Posiziona dentro parent
// position:relative + overflow:hidden.
//
// Use sparingly: solo su Hero homepage o landing principali, NON su
// dense content sections (riduce readability + GPU cost).

export function AuroraBackground({ accent }: { accent?: string }) {
  return (
    <div className="aurora-mesh" aria-hidden="true">
      <div
        className="aurora-blob aurora-blob-1"
        style={accent ? { background: accent } : undefined}
      />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  )
}
