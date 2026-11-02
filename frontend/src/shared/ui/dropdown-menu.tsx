'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Primitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/shared/lib/utils';

const Menu = Primitive.Root;
const MenuTrigger = Primitive.Trigger;

const MenuContent = forwardRef<
  ElementRef<typeof Primitive.Content>,
  ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-56 animate-fade-in rounded-xl border bg-card p-1.5 text-card-foreground shadow-overlay',
        className,
      )}
      {...props}
    />
  </Primitive.Portal>
));
MenuContent.displayName = 'MenuContent';

const MenuItem = forwardRef<
  ElementRef<typeof Primitive.Item>,
  ComponentPropsWithoutRef<typeof Primitive.Item>
>(({ className, ...props }, ref) => (
  <Primitive.Item
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-muted [&_svg]:size-4 [&_svg]:shrink-0',
      className,
    )}
    {...props}
  />
));
MenuItem.displayName = 'MenuItem';

const MenuSeparator = forwardRef<
  ElementRef<typeof Primitive.Separator>,
  ComponentPropsWithoutRef<typeof Primitive.Separator>
>(({ className, ...props }, ref) => (
  <Primitive.Separator
    ref={ref}
    className={cn('-mx-1.5 my-1.5 h-px bg-border', className)}
    {...props}
  />
));
MenuSeparator.displayName = 'MenuSeparator';

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator };
export const MenuLabel = Primitive.Label;
