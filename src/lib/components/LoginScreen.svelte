<script lang="ts">
  import { licenceOptions, uiImages } from '$lib/data';
  import { getFakeInfoForCandidate } from '$lib/fake-info';
  import type { CandidateInfo, Session } from '$lib/types';
  import MessageDialog from './MessageDialog.svelte';

  interface Props {
    onstart: (session: Session) => void;
  }

  let { onstart }: Props = $props();
  let licence = $state('A1');
  let candidateNumber = $state('');
  let candidate = $state<CandidateInfo | null>(null);
  let validationWarningOpen = $state(false);

  function validateCandidate() {
    candidateNumber = candidateNumber.trim();
    if (!candidateNumber) {
      validationWarningOpen = true;
      return;
    }
    validationWarningOpen = false;
    candidate = getFakeInfoForCandidate(candidateNumber);
  }

  function resetCandidate() {
    candidate = null;
    candidateNumber = '';
    validationWarningOpen = false;
  }

  function beginExam() {
    if (!candidate) return;
    onstart({ candidateNumber, licence, candidate });
  }
</script>

<main class="desktop" style:background-image={`url(${uiImages.wallpaperUrl})`}>
  <section class="login-window" aria-label="Đăng nhập thi sát hạch">
    <div class="window-titlebar">
      <span>Thi trắc nghiệm lý thuyết trên máy vi tính</span>
      <button class="window-close" aria-label="Đóng" onclick={resetCandidate}>×</button>
    </div>

    <header class="brand-header">
      <img src={uiImages.cardUrl} alt="" />
    </header>

    <div class="module-title">SÁT HẠCH CẤP GPLX</div>

      <div class="login-main">
        <div class="login-form">
          <label for="unit">Đơn vị:</label>
          <select id="unit"><option>001 - TRUNG TÂM SÁT HẠCH LÁI XE</option></select>

          <label for="course">Khóa:</label>
          <select id="course" bind:value={licence}>
            {#each licenceOptions as option (option)}<option value={option}>{option}</option>{/each}
          </select>

          <label for="candidate">Số báo danh:</label>
          <div class="candidate-row">
            <input
              id="candidate"
              bind:value={candidateNumber}
              onkeydown={(event) => event.key === 'Enter' && validateCandidate()}
              autocomplete="off"
            />
            <button class="verify-button" onclick={validateCandidate}>
              <img src={uiImages.checklistUrl} alt="" /><span>Kiểm tra<br />thông tin</span>
            </button>
          </div>
        </div>

        <section class="candidate-preview" class:is-empty={!candidate}>
          <img src={uiImages.portraitUrl} alt="Ảnh thí sinh" />
          <dl>
            <div><dt>Loại GPLX:</dt><dd>{candidate ? licence : '-'}</dd></div>
            <div><dt>Họ tên:</dt><dd>{candidate?.name ?? '-'}</dd></div>
            <div><dt>Ngày sinh:</dt><dd>{candidate?.birthDate ?? '-'}</dd></div>
            <div><dt>Số định danh:</dt><dd>{candidate?.identity ?? '-'}</dd></div>
            <div><dt>Địa chỉ:</dt><dd>{candidate?.address ?? '-'}</dd></div>
          </dl>
        </section>

        <div class="login-actions">
          {#if candidate}<div class="exam-state">CHƯA THI</div>{/if}
          <div class="action-buttons">
            <button class:ready={Boolean(candidate)} disabled={!candidate} onclick={beginExam}>
              {candidate ? 'Vào thi' : 'Đăng nhập'}
            </button>
            <button onclick={resetCandidate}>Hủy bỏ</button>
          </div>
        </div>
      </div>
  </section>

  {#if validationWarningOpen}
    <MessageDialog
      title="Message"
      message="Xin mời nhập số báo danh!"
      iconUrl={uiImages.warnUrl}
      width={230}
      onprimary={() => (validationWarningOpen = false)}
      onclose={() => (validationWarningOpen = false)}
    />
  {/if}
</main>

<style>
  .desktop { height: 100%; display: grid; place-items: center; background-size: cover; background-position: center; font-family: "Times New Roman", serif; color: #263d55; }
  .login-window { width: 690px; background: #e9f1ef; border: 1px solid #6b7e84; border-radius: 9px; box-shadow: 0 20px 55px #001a2d66, inset 0 0 0 3px #e2eae8; overflow: hidden; position: relative; transform: translateY(-10px); }
  .window-titlebar { height: 31px; padding: 7px 8px 0; color: #101010; background: #f4f4f4; font: 15px "Segoe UI", sans-serif; }
  .window-close { border: 0; color: white; background: #c92f2f; font: bold 17px Arial; line-height: 22px; position: absolute; right: 3px; top: 3px; width: 26px; height: 24px; border-radius: 0; }
  .brand-header { height: 143px; border-bottom: 1px solid #b58d4b; overflow: hidden; }
  .brand-header img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
  .module-title { height: 36px; padding-left: 12px; background: #ff6666; border: 1px solid; border-color: #ffadad #9d282e #8d2026 #ffadad; box-shadow: inset 1px 1px 0 #ffffff80, inset -1px -1px 0 #8d202666; color: #392781; font: bold 20px/34px Arial; letter-spacing: .3px; }
  .login-main { background: linear-gradient(45deg, #F0FFF0, #F5F5DC); min-width: 0; flex: 1; margin: 10px; padding: 30px; display: flex; flex-direction: column; gap: 30px; border: 2px solid #78898b; border-radius: 10px; box-shadow: inset 0 0 0 1px #ffffff80; color: #0000ff; }
  .login-form { display: grid; grid-template-columns: 125px 1fr; grid-auto-rows: 35px; gap: 8px 12px; align-items: center; font-weight: bold; font-size: 17px; }
  .login-form label { padding-left: 6px; }
  .login-form select, .login-form input { min-width: 0; height: 35px; background: #f8faf9; border: 1px solid #809097; box-shadow: none; padding: 4px 8px; color: #222; font-weight: bold; }
  #course { width: 50%; }
  .login-form input:focus { border-bottom: 2px solid #0067c0; }
  .candidate-row { height: 35px; display: flex; align-items: flex-start; gap: 30px; }
  .candidate-row input { width: 120px; color: #b23f5c; font-size: 19px; }
  .verify-button, .action-buttons button { position: relative; height: 50px; padding: 0 30px; border: 1px solid #d0d0d0; border-radius: 4px; background: #fdfdfd; color: #0000ff; isolation: isolate; font: bold 14px Arial; }
  .verify-button::after, .action-buttons button::after { content: ''; position: absolute; inset: 2px; border: 1px solid white; border-radius: 0; background: #ffe4c4; pointer-events: none; z-index: -1; }
  .verify-button:not(:disabled):hover, .action-buttons button:not(:disabled):hover { border-color: #0078d4; }
  .verify-button { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; text-align: left; line-height: 21px; }
  .verify-button:disabled { cursor: default; }
  .verify-button img { width: 32px; height: 32px; flex: 0 0 32px; object-fit: contain; }
  .verify-button:disabled img { filter: grayscale(1); opacity: .55; }
  .candidate-preview { display: flex; flex-direction: row; gap: 22px; font-size: 17px; }
  .candidate-preview img { width: 96px; aspect-ratio: 3 / 4; border: 1px solid #777; object-fit: cover; }
  .candidate-preview.is-empty img { filter: grayscale(1); opacity: .78; }
  dl { margin: 0; }
  .candidate-preview dl { display: flex; flex-direction: column; gap: 8px; }
  .candidate-preview dl div { display: grid; grid-template-columns: 135px 1fr; min-width: 0; }
  dt, dd { margin: 0; }
  .candidate-preview dd { font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .candidate-preview.is-empty dd { font-weight: normal; }
  .exam-state { font: bold 21px Arial; }
  .login-actions { margin: 0px 40px 0 10px; display: flex; align-items: center; }
  .action-buttons { margin-left: auto; display: flex; align-items: center; gap: 120px}
  .action-buttons button:disabled { cursor: default; }
</style>
