import { useId } from "react";

interface CurvedTextProps {
  text: string;
  path: string;
  width?: number;
  height?: number;
  viewBox?: string;
  animate?: boolean;
  duration?: number;
  count?: number;
  fontSize?: number;
  fill?: string;
  pathId?: string;
  showPath?: boolean;
  pathStroke?: string;
  pathStrokeWidth?: number;
  className?: string;
}

const CurvedText: React.FC<CurvedTextProps> = ({
  text,
  path,
  width = 400,
  height = 200,
  animate = false,
  duration = 10,
  count = 2,
  fontSize = 16,
  fill = "#333",
  pathId = "textPathCurve",
  showPath = true,
  pathStroke = "#EC4899",
  pathStrokeWidth = 50,
  className,
}) => {
  const id = useId();
  const pathIdUnique = `${pathId}-${id}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 200"
      className={className}
    >
      {/* Define the path */}
      <defs>
        <path id={pathIdUnique} d={path} fill="none" strokeLinecap="round" />
      </defs>

      {/* Optional: show the visible stroke of the path */}
      {showPath && (
        <use
          href={`#${pathIdUnique}`}
          fill="none"
          stroke={pathStroke}
          strokeWidth={pathStrokeWidth}
        />
      )}

      {/* Render the text along the path */}
      <text fill={fill} fontSize={fontSize}>
        {Array.from({ length: count + 1 }).map((_, index) => {
          const offset = index === count - 1 ? -100 : (index * 100) / count;
          return (
            <textPath
              key={index}
              href={`#${pathIdUnique}`}
              startOffset={`${offset}%`}
              alignmentBaseline="middle"
            >
              {text}
              {animate && (
                <animate
                  attributeName="startOffset"
                  from={`${offset}%`}
                  to={`${offset + 100}%`}
                  begin="0s"
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              )}
            </textPath>
          );
        })}
      </text>
    </svg>
  );
};

export default CurvedText;
