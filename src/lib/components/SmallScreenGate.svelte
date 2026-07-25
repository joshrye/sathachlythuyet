<script lang="ts">
  import { onMount, tick, type Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
  let invalidViewport = $state(false);
  let dismissed = $state(false);
  let continueButton = $state<HTMLButtonElement>();

  const warningOpen = $derived(invalidViewport && !dismissed);

  function updateViewportState(): void {
    invalidViewport =
      window.innerWidth < 1280 ||
      window.innerHeight < 720 ||
      window.matchMedia('(orientation: portrait)').matches;
  }

  function continueAnyway(): void {
    dismissed = true;
  }

  function keepFocusInWarning(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    continueButton?.focus();
  }

  onMount(() => {
    updateViewportState();
    window.addEventListener('resize', updateViewportState);

    return () => window.removeEventListener('resize', updateViewportState);
  });

  $effect(() => {
    if (!warningOpen) return;

    void tick().then(() => continueButton?.focus());
  });
</script>

<div class="application" inert={warningOpen} aria-hidden={warningOpen}>
  {@render children()}
</div>

{#if warningOpen}
  <dialog
    open
    class="warning-backdrop"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="screen-warning-title"
    aria-describedby="screen-warning-description"
    onkeydown={keepFocusInWarning}
  >
    <div class="warning-content">
      <h1 id="screen-warning-title">Màn hình không phù hợp</h1>
      <p id="screen-warning-description">
        Hãy thử dùng màn hình lớn hơn để có trải nghiệm tốt nhất.
      </p>
      <button bind:this={continueButton} type="button" onclick={continueAnyway}>
        Vẫn tiếp tục
      </button>
    </div>
  </dialog>
{/if}

<style>
  .application {
    width: 100%;
    height: 100%;
  }

  .warning-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    width: 100vw;
    max-width: none;
    height: 100dvh;
    max-height: none;
    display: grid;
    place-items: center;
    margin: 0;
    padding: clamp(24px, 6vw, 42px);
    overflow: auto;
    border: 0;
    background: #dce7ea;
    color: #17212b;
    text-align: center;
    font-family: "Segoe UI Variable Text", "Segoe UI", Arial, sans-serif;
  }

  h1 {
    margin: 0;
    color: #193f71;
    font-size: clamp(24px, 6vw, 32px);
    line-height: 1.15;
  }

  p {
    max-width: 34ch;
    margin: 14px auto 28px;
    color: #33434e;
    font-size: 16px;
    line-height: 1.55;
  }

  button {
    min-height: 42px;
    padding: 9px 20px;
    border: 1px solid #123b70;
    border-radius: 6px;
    background: #1d5796;
    color: #f8fafc;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 22%), 0 2px 5px rgb(20 55 90 / 20%);
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
  }

  button:hover {
    background: #174b85;
  }

  button:active {
    background: #123f73;
  }
</style>
