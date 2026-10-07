export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (
      typeof requestAnimationFrame ===
      "function"
    ) {
      requestAnimationFrame(() => {
        resolve();
      });

      return;
    }

    setTimeout(resolve, 0);
  });
}