'use client';

import React, { useSyncExternalStore } from 'react';
import { ownerStore } from '@/lib/ownerStore';
import { OwnerLayout } from '@/components/owner/OwnerLayout';
import { SettingsPanel } from '@/components/owner/SettingsPanel';

export default function OwnerSettingsPage() {
  useSyncExternalStore(
    ownerStore.subscribe.bind(ownerStore),
    () => ownerStore.getVersion(),
    () => 0
  );

  const settings = ownerStore.getSettings();

  const refreshSettings = () => {
    // updates via ownerStore reactively
  };

  return (
    <OwnerLayout
      title="SYSTEM SETTINGS"
      subtitle="Operating Hours, Online Ordering Controls & Store Info"
    >
      <SettingsPanel settings={settings} onRefresh={refreshSettings} />
    </OwnerLayout>
  );
}
