import { Vector2 } from "@math.gl/core";

export interface TouchPointer {
    id: number;
    pos: Vector2;
    prevPos: Vector2;
    downTime: number;
    isPressed: boolean;
    pointerType: "mouse" | "touch" | "pen"; // Pointer Events API type
    pressure: number; // 0.0 to 1.0 (pressure sensitivity)
    isPrimary: boolean; // True if this is the primary pointer
}

/**
 * MultiTouch input handler using Pointer Events API
 * Supports mouse, touch, pen input with a unified interface
 * Automatically detects and tracks multiple simultaneous pointers
 */
export default class MultiTouchInput {
    private activePointers: Map<number, TouchPointer> = new Map();

    // Event callbacks
    onPointerStart?: (pointerId: number, pos: Vector2, pointerType: string) => void;
    onPointerMove?: (pointerId: number, pos: Vector2) => void;
    onPointerEnd?: (pointerId: number, pos: Vector2) => void;

    constructor(canvas: HTMLCanvasElement) {
        this.setupPointerListeners(canvas);
    }

    /**
     * Setup Pointer Events listeners (modern unified input API)
     * Works for mouse, touch, and pen input automatically
     */
    private setupPointerListeners(canvas: HTMLCanvasElement) {
        // Pointer down
        canvas.addEventListener("pointerdown", (e: PointerEvent) => {
            e.preventDefault();
            const pos = this.getPointerPosition(canvas, e);
            this.startPointer(e.pointerId, pos, e);
            this.onPointerStart?.(e.pointerId, pos, e.pointerType);
        });

        // Pointer move
        canvas.addEventListener("pointermove", (e: PointerEvent) => {
            // Only prevent default for touch to avoid scrolling
            if (e.pointerType === "touch") {
                e.preventDefault();
            }
            const pos = this.getPointerPosition(canvas, e);
            this.movePointer(e.pointerId, pos, e);
            this.onPointerMove?.(e.pointerId, pos);
        });

        // Pointer up
        canvas.addEventListener("pointerup", (e: PointerEvent) => {
            const pos = this.getPointerPosition(canvas, e);
            this.endPointer(e.pointerId, pos);
            this.onPointerEnd?.(e.pointerId, pos);
        });

        // Pointer cancel (lost input - e.g. system gesture, too many pointers)
        canvas.addEventListener("pointercancel", (e: PointerEvent) => {
            const pos = this.getPointerPosition(canvas, e);
            this.endPointer(e.pointerId, pos);
        });

        // Pointer leave (mouse leaves canvas)
        canvas.addEventListener("pointerleave", (e: PointerEvent) => {
            if (e.pointerType === "mouse") {
                const pos = this.getPointerPosition(canvas, e);
                this.endPointer(e.pointerId, pos);
            }
        });
    }

    /**
     * Get pointer position relative to canvas
     */
    private getPointerPosition(canvas: HTMLCanvasElement, event: PointerEvent): Vector2 {
        const rect = canvas.getBoundingClientRect();
        return new Vector2(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }

    /**
     * Start tracking a pointer
     */
    private startPointer(pointerId: number, pos: Vector2, event: PointerEvent) {
        const pointer: TouchPointer = {
            id: pointerId,
            pos: pos.clone(),
            prevPos: pos.clone(),
            downTime: Date.now(),
            isPressed: true,
            pointerType: event.pointerType as "mouse" | "touch" | "pen",
            pressure: event.pressure,
            isPrimary: event.isPrimary,
        };
        this.activePointers.set(pointerId, pointer);
    }

    /**
     * Update pointer position
     */
    private movePointer(pointerId: number, pos: Vector2, event: PointerEvent) {
        const pointer = this.activePointers.get(pointerId);
        if (pointer) {
            pointer.prevPos = pointer.pos.clone();
            pointer.pos = pos.clone();
            pointer.pressure = event.pressure;
            pointer.isPrimary = event.isPrimary;
        }
    }

    /**
     * End pointer tracking
     */
    private endPointer(pointerId: number, pos: Vector2) {
        const pointer = this.activePointers.get(pointerId);
        if (pointer) {
            pointer.isPressed = false;
            this.activePointers.delete(pointerId);
        }
    }

    /**
     * Get a specific pointer by ID
     */
    getPointer(pointerId: number): TouchPointer | undefined {
        return this.activePointers.get(pointerId);
    }

    /**
     * Get all active pointers
     */
    getAllPointers(): TouchPointer[] {
        return Array.from(this.activePointers.values());
    }

    /**
     * Get the primary pointer (first one pressed)
     */
    getPrimaryPointer(): TouchPointer | undefined {
        if (this.activePointers.size === 0) return undefined;
        // Find primary pointer, or return first one
        for (const pointer of this.activePointers.values()) {
            if (pointer.isPrimary) {
                return pointer;
            }
        }
        return this.activePointers.values().next().value;
    }

    /**
     * Get pointers by type
     */
    getPointersByType(type: "mouse" | "touch" | "pen"): TouchPointer[] {
        return Array.from(this.activePointers.values()).filter(p => p.pointerType === type);
    }

    /**
     * Check if any pointer is pressed
     */
    isAnyPointerPressed(): boolean {
        return this.activePointers.size > 0;
    }

    /**
     * Get number of active pointers
     */
    getPointerCount(): number {
        return this.activePointers.size;
    }

    /**
     * Legacy aliases for backward compatibility
     */
    getTouch(id: number): TouchPointer | undefined {
        return this.getPointer(id);
    }

    getAllTouches(): TouchPointer[] {
        return this.getAllPointers();
    }

    getPrimaryTouch(): TouchPointer | undefined {
        return this.getPrimaryPointer();
    }

    isAnyTouchPressed(): boolean {
        return this.isAnyPointerPressed();
    }

    getTouchCount(): number {
        return this.getPointerCount();
    }
}
