import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";

export function SortableWidget({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`}>
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 right-2 z-20 p-2 bg-[hsl(var(--card))]/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shadow-sm border border-[hsl(var(--border))]"
      >
        <GripHorizontal className="w-4 h-4 text-[hsl(var(--foreground))]/50" />
      </div>
      {children}
    </div>
  );
}
