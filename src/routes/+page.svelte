<script lang="ts">
  import ExamScreen from '$lib/components/ExamScreen.svelte';
  import LoginScreen from '$lib/components/LoginScreen.svelte';
  import ResultScreen from '$lib/components/ResultScreen.svelte';
  import { uiImages } from '$lib/data';
  import type { ExamResult, Session } from '$lib/types';

  let session = $state<Session | null>(null);
  let result = $state<ExamResult | null>(null);

  function startSession(nextSession: Session): void {
    session = nextSession;
    result = null;
  }

  function completeExam(examResult: ExamResult): void {
    result = examResult;
  }

  function finishSession() {
    session = null;
    result = null;
  }
</script>

<svelte:head>
  <title>Phần mềm thi sát hạch lý thuyết</title>
  {#each Object.values(uiImages) as imageUrl (imageUrl)}
    <link rel="preload" as="image" href={imageUrl} />
  {/each}
</svelte:head>

{#if !session}
  <LoginScreen onstart={startSession} />
{:else}
  <ExamScreen {session} oncomplete={completeExam} disabled={Boolean(result)} />
  {#if result}
    <ResultScreen {session} {result} onfinish={finishSession} />
  {/if}
{/if}
