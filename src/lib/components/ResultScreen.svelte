<script lang="ts">
  import { uiImages } from '$lib/data';
  import type { ExamResult, Session } from '$lib/types';

  interface Props {
    session: Session;
    result: ExamResult;
    onfinish: () => void;
  }

  let { session, result, onfinish }: Props = $props();
</script>

<section class="result-window">
  <div class="result-titlebar">
    <strong>Kết quả thi thí sinh</strong><button aria-label="Đóng" onclick={onfinish}>×</button>
  </div>

  <fieldset class="result-candidate">
    <legend>Thông tin thí sinh</legend>
    <img src={uiImages.portraitUrl} alt="Ảnh thí sinh" />
    <dl>
      <div><dt>Số báo danh:</dt><dd>{session.candidateNumber}</dd></div>
      <div><dt>Họ tên:</dt><dd>{session.candidate.name}</dd></div>
      <div><dt>Ngày sinh:</dt><dd>{session.candidate.birthDate}</dd></div>
      <div><dt>Địa chỉ:</dt><dd>{session.candidate.address}</dd></div>
      <div><dt>Số CMT:</dt><dd>{session.candidate.identity}</dd></div>
    </dl>
    <div class="result-licence"><span>Hạng GPLX:</span><b>{session.licence}</b></div>
  </fieldset>

  <fieldset class="result-details">
    <legend>Kết quả thi</legend>
    <div class="statistics">
      <div><b>SỐ CÂU TRẢ LỜI ĐÚNG:</b><strong>{result.correct}</strong></div>
      <div><b>SỐ CÂU TRẢ LỜI SAI:</b><strong>{result.wrong}</strong></div>
      <div><b>SỐ CÂU CHƯA TRẢ LỜI:</b><strong>{result.unanswered}</strong></div>
    </div>
    <div class="verdict">
      <b>KẾT QUẢ:</b><strong class:passed={result.passed}>{result.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}</strong>
    </div>
    {#if result.criticalWrong.length}
      <p class="failure-note">
        Trả lời sai Câu xử lý tình huống mất an toàn giao thông nghiêm trọng, câu số: {result.criticalWrong.join(', ')}
      </p>
    {/if}
  </fieldset>

  <div class="result-actions"><button onclick={onfinish}><img src={uiImages.closeUrl} alt="" /> Kết thúc</button></div>
</section>

<style>
  .result-window { position: fixed; top: 50%; left: 50%; z-index: 20; width: 770px; min-height: 525px; border: 1px solid #506d7d; background: #edf4f2; box-shadow: 0 18px 55px #0005; padding: 45px 18px 18px; transform: translate(-50%, -50%); font-family: Arial, sans-serif; }
  .result-titlebar { position: absolute; inset: 0 0 auto; height: 35px; display: flex; align-items: center; justify-content: space-between; padding-left: 8px; border-bottom: 1px solid #62818f; color: #183750; background: linear-gradient(to bottom, #d8e9f1, #c4dde8); font-size: 17px; }
  .result-titlebar button { border: 0; color: #183750; background: transparent; font: bold 17px Arial; line-height: 22px; width: 27px; height: 25px; margin-right: 4px; }
  .result-titlebar button:hover { background: rgb(255 255 255 / 28%); }
  .result-titlebar button:active { background: rgb(24 55 80 / 10%); }
  .result-window fieldset { border: 1px solid #9ea7a6; background: #eef4f1; }
  .result-window legend { font-weight: bold; color: #213538; padding: 0 7px; }
  .result-candidate { min-height: 183px; display: grid; grid-template-columns: 104px 1fr 130px; gap: 16px; padding: 14px 18px; }
  .result-candidate img { width: 100px; aspect-ratio: 3 / 4; object-fit: cover; border: 3px solid; border-color: #71848b #f8ffff #f8ffff #71848b; box-shadow: inset 1px 1px 2px rgb(0 0 0 / 25%); }
  .result-candidate dl { display: flex; flex-direction: column; justify-content: space-between; margin: 0; color: #405078; }
  .result-candidate dl div { display: grid; grid-template-columns: 105px minmax(0, 1fr); }
  dt, dd { margin: 0; }
  .result-candidate dd { color: #314780; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .result-licence { color: #405078; }
  .result-licence b { margin-left: 12px; color: #314780; }
  .result-details { min-height: 210px; margin-top: 10px; padding: 23px 20px 15px; display: grid; grid-template-columns: 1.45fr 1fr; }
  .statistics { display: flex; flex-direction: column; gap: 20px; }
  .statistics div { display: grid; grid-template-columns: 265px 1fr; }
  .statistics strong, .verdict strong { color: #b31d28; }
  .verdict { display: flex; gap: 24px; font-size: 18px; }
  .verdict strong.passed { color: #128032; }
  .failure-note { grid-column: 1 / -1; align-self: end; margin: 15px 0 0; color: #5d3e42; font: italic 13px Arial; }
  .result-actions { display: flex; justify-content: flex-end; padding: 14px 8px 0; }
  .result-actions button { width: 112px; height: 41px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; border: 1px solid #b8b8b8; border-radius: 4px; background: #f4f7f7; color: #333; font: 13px Arial; }
  .result-actions img { width: 28px; height: 28px; object-fit: contain; }
</style>
