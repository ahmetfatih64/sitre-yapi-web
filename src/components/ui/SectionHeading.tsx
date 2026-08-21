import { cn } from "@/lib/utils";

type Props = {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  overline,
  title,
  description,
  align = "left",
  size = "lg",
  as: Tag = "h2",
  className,
}: Props) {
  const sizeClass =
    size === "xl" ? "display-xl" : size === "md" ? "display-md" : "display-lg";
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {overline ? <span className="eyebrow">{overline}</span> : null}
      <Tag className={sizeClass}>{title}</Tag>
      {description ? <p className="lede">{description}</p> : null}
    </div>
  );
}
