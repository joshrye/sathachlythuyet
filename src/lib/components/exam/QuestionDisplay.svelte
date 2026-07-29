<script lang="ts">
  import { onMount } from 'svelte';
  import { getQuestionImageUrl } from '$lib/data';
  import type { Question } from '$lib/types';

  interface Props {
    question: Question | undefined;
  }

  let { question }: Props = $props();

  const nativeWidth = 1024;
  const nativeHeight = nativeWidth * (2 / 3);
  let viewport: HTMLDivElement;
  let scaleX = $state(1);
  let scaleY = $state(1);

  onMount(() => {
    const resize = () => {
      scaleX = viewport.clientWidth / nativeWidth;
      scaleY = viewport.clientHeight / nativeHeight;
    };
    const observer = new ResizeObserver(resize);

    observer.observe(viewport);
    resize();

    return () => observer.disconnect();
  });
</script>

<div class="question-viewport" bind:this={viewport}>
  <div class="question-display" style:transform={`scale(${scaleX}, ${scaleY})`}>
    {#if question}
      <h1>{question.text}</h1>
      {#if question.image}
        <img class="question-image" src={getQuestionImageUrl(question.image)} alt="Hình minh họa câu hỏi" />
      {/if}
      <ol>
        {#each question.answers as answer (answer.id)}
          <li>{answer.text}</li>
        {/each}
      </ol>
    {/if}
  </div>
</div>

<style>
  .question-viewport { width: 100%; min-height: 0; flex: 1 1 0; overflow: hidden; background: white; -webkit-touch-callout: none; }
  .question-display { width: 1024px; aspect-ratio: 3 / 2; box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; gap: 0; overflow: auto; padding: 0; margin: 0; transform-origin: top left; background: #fff; font-family: "Times New Roman", serif; }
  .question-display h1 { margin: 0; color: #851c21; font-size: 32px; line-height: 1.05; }
  .question-display ol { margin: 0; padding: 0; list-style-position: inside; font-size: 30px; line-height: 1.18; }
  .question-display li { padding: 0; margin: 0; }
  .question-image { display: block; align-self: flex-start; width: min(720px, 100%); height: 518px; margin: 0; object-fit: contain; object-position: left center; }
</style>
