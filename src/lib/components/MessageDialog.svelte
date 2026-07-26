<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    title: string;
    message: string;
    iconUrl: string;
    onprimary: () => void;
    onclose: () => void;
    primaryLabel?: string;
    secondaryLabel?: string;
    onsecondary?: () => void;
    width?: number;
  }

  let {
    title,
    message,
    iconUrl,
    onprimary,
    onclose,
    primaryLabel = 'OK',
    secondaryLabel,
    onsecondary = onclose,
    width = 260
  }: Props = $props();
  let primaryButton: HTMLButtonElement;
  let dialog: HTMLDialogElement;

  onMount(() => {
    dialog.showModal();
    primaryButton.focus();
  });

  function handleCancel(event: Event): void {
    event.preventDefault();
    onclose();
  }
</script>

<dialog
  bind:this={dialog}
  class="message-dialog"
  style:width={`${width}px`}
  aria-labelledby="message-dialog-title"
  aria-describedby="message-dialog-message"
  oncancel={handleCancel}
>
  <div class="dialog-titlebar">
    <span id="message-dialog-title">{title}</span>
    <button type="button" class="close-button" aria-label="Đóng" onclick={onclose}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        <path d="M1 1l8 8M9 1 1 9"></path>
      </svg>
    </button>
  </div>

  <div class="dialog-content">
    <img src={iconUrl} alt="" />
    <p id="message-dialog-message">{message}</p>
  </div>

  <div class="dialog-actions">
    <button type="button" bind:this={primaryButton} onclick={onprimary}>{primaryLabel}</button>
    {#if secondaryLabel}
      <button type="button" class="secondary-button" onclick={onsecondary}>{secondaryLabel}</button>
    {/if}
  </div>
</dialog>

<style>
  .message-dialog::backdrop {
    background: transparent;
  }

  .message-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    margin: 0;
    padding: 0;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border: 1px solid #9d9d9d;
    border-radius: 8px;
    background: #f3f3f3;
    box-shadow: 0 16px 32px rgb(0 0 0 / 28%);
    color: #1a1a1a;
    font-family: "Segoe UI Variable Text", "Segoe UI", sans-serif;
    font-size: 12px;
  }

  .dialog-titlebar {
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 6px;
    background: #f3f3f3;
    user-select: none;
  }

  .close-button {
    width: 45px;
    height: 25px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #111;
  }

  .close-button svg { width: 10px; height: 10px; }
  .close-button path { fill: none; stroke: currentColor; stroke-width: 1; }
  .close-button:hover { background: #c42b1c; color: #fff; }
  .close-button:active { background: #b22417; }

  .dialog-content {
    min-height: 78px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 20px 12px 21px;
    background: #fff;
  }

  .dialog-content img {
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    object-fit: contain;
  }

  .dialog-content p { margin: 0; line-height: 1.35; white-space: nowrap; }

  .dialog-actions {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 17px;
    background: #f3f3f3;
  }

  .dialog-actions button {
    width: 73px;
    height: 22px;
    padding: 0 10px;
    border: 1px solid #c7c7c7;
    border-radius: 4px;
    background: #fbfbfb;
    box-shadow: 0 1px 1px rgb(0 0 0 / 8%);
    color: #111;
    font: 12px "Segoe UI Variable Text", "Segoe UI", sans-serif;
  }

  .dialog-actions button:hover { background: #f6f6f6; }
  .dialog-actions button:active { background: #eee; color: #555; }
  .dialog-actions button:focus-visible { outline: 2px solid #000; outline-offset: -3px; }
  .dialog-actions .secondary-button { border-color: #0067c0; }
</style>
