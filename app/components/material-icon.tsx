type MaterialIconProps = {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
};

/** Material Symbols with opsz matched to pixel size (required for small icons). */
export function MaterialIcon({
  name,
  size = 24,
  fill = false,
  className = "",
}: MaterialIconProps) {
  const fillFlag = fill ? 1 : 0;
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${fillFlag}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
