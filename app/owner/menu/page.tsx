'use client';

import React, { useSyncExternalStore } from 'react';
import { ownerStore } from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { MenuManager } from '@/components/owner/MenuManager';

export default function OwnerMenuPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const menuItems = ownerStore.getMenuItems();

  const refreshMenu = () => {
    // updates via ownerStore reactively
  };

  return (
    <OwnerLayout
      title="MENU & 86 LIST"
      subtitle="Artisanal Pies, Realtime Availability & Roster Pricing"
    >
      <MenuManager menuItems={menuItems} onRefresh={refreshMenu} />
    </OwnerLayout>
  );
}
