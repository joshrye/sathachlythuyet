<script lang="ts">
  import { uiImages } from '$lib/data';
  import type { Session } from '$lib/types';

  interface Props {
    session: Session;
  }

  let { session }: Props = $props();
</script>

<div class="candidate-credit">
  <section class="candidate-card">
    <h2>Thí sinh sát hạch</h2>
    <div class="card-content">
      <img src={uiImages.portraitUrl} alt="Ảnh thí sinh" />
      <dl>
        <div><dt>SBD:</dt><dd>{session.candidateNumber}</dd><dt>Hạng:</dt><dd>{session.licence}</dd></div>
        <div><dt>Họ và tên:</dt><dd>{session.candidate.name}</dd></div>
        <div><dt>Số định danh:</dt><dd>{session.candidate.identity}</dd></div>
      </dl>
    </div>
  </section>
  <section class="credit-card">
    <h2>Thông tin bản quyền</h2>
    <img src={uiImages.cardUrl} alt="Thông tin bản quyền" />
    <b>BỘ 600 CÂU HỎI</b>
  </section>
</div>

<style>
  .candidate-credit { min-width: 0; display: grid; grid-template-columns: 7fr 3fr; height: 148px; color: #e5f7f5; }
  .candidate-card, .credit-card { min-width: 0; }
  .candidate-card { display: flex; flex-direction: column; border: 1px solid #000; }
  .credit-card { border: 1px solid #000; }
  .candidate-card h2, .credit-card h2 { height: 29px; flex: 0 0 29px; line-height: 27px; margin: 0; padding: 0 9px; background: #0f8673; border: 1px solid; border-color: #9fd6cc #06483e #06483e #9fd6cc; font: bold 18px Tahoma, sans-serif; color: #d7ebe7; }
  .card-content { min-height: 0; flex: 1 1 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); gap: 12px; padding: 0 12px 0 0; }
  .card-content img { min-height: 0; height: 100%; aspect-ratio: 3 / 4; object-fit: cover; }
  .card-content dl { display: flex; flex-direction: column; justify-content: space-evenly; margin: 0; padding: 0; font: 16px "Times New Roman", serif; }
  .card-content dl div { display: grid; grid-template-columns: max-content max-content max-content minmax(0, 1fr); }
  .card-content dl div:first-child dt:nth-of-type(2) { margin-left: 24px; }
  .card-content dl div:not(:first-child) { grid-template-columns: max-content minmax(0, 1fr); }
  dt, dd { margin: 0; }
  .card-content dd { margin-left: .25em; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .credit-card { display: flex; flex-direction: column; }
  .credit-card > img { min-height: 0; width: 100%; flex: 1 1 0; display: block; object-fit: cover; }
  .credit-card > b { height: 27px; flex: 0 0 27px; display: flex; align-items: center; padding: 0 9px; color: #e5f7f5; font: bold 14px Arial; }
</style>
