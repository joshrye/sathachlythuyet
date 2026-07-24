<script lang="ts">
  import { uiImages } from '$lib/data';
  import MessageDialog from '../MessageDialog.svelte';

  interface Props {
    onconfirm: () => void;
    oncancel: () => void;
  }

  let { onconfirm, oncancel }: Props = $props();
</script>

<MessageDialog
  title="Kết thúc thi"
  message="Bạn có muốn kết thúc phần thi?"
  iconUrl={uiImages.questionMarkUrl}
  onprimary={onconfirm}
  onclose={oncancel}
  secondaryLabel="Cancel"
  onsecondary={oncancel}
/>
