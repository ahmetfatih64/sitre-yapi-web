import { cn } from "@/lib/utils";

type Props = {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
  as?: "h1" | "h2" | "h3";
  /** "dark" = koyu zemin üstünde açık renk metin. */
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  overline,
  title,
  description,
  align = "left",
  size = "lg",
  as: Tag = "h2",
  tone = "light",
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
      <Tag className={cn(sizeClass, tone === "dark" && "text-white")}>
        {title}
      </Tag>
      {description ? (
        <p className={cn("lede", tone === "dark" && "!text-white/70")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
