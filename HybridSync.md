Hybrid Sync Explained 🔄
Hybrid Sync is a planned feature (not yet fully implemented) for the Church Display Console that combines the best of both local and cloud storage:

🎯 Purpose
It's designed to give you cross-device consistency while maintaining offline reliability.

🔧 How It Works
Local Storage (Primary)
All your settings, presets, and pinned content are stored locally in your browser (using LocalStorage/IndexedDB)
This ensures the app works offline and loads instantly
No internet required for day-to-day operation
Cloud Sync (Secondary)
The same data is synchronized to the cloud
Allows you to access your settings from multiple computers
Perfect for churches with multiple control stations or volunteers working from different locations
💡 Use Cases
Multi-Computer Setup: Configure your presentation styles at home, then use them at church
Team Collaboration: Multiple volunteers can share the same presets and pinned content
Backup: Your settings are safely backed up in the cloud
Consistency: Same look and feel across all devices
⚙️ Current Status
Looking at the code, the UI elements are in place (the "Sync Code" input and "Connect" button in Settings), but the actual synchronization logic hasn't been implemented yet. It's a placeholder for future functionality.

🔮 When Implemented, You'll Be Able To:
Generate a sync code on one device
Enter that code on another device to link them
Have all your settings automatically sync between devices
For now, you can use the Export/Import Preset buttons in the Settings section to manually transfer your configurations between devices! 📦
