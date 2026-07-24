/** The non-standard event Chromium fires when a PWA is installable. */
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface WindowWithInstall extends Window {
    __deferredInstallPrompt?: BeforeInstallPromptEvent;
}
