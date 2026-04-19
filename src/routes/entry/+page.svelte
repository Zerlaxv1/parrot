<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Alert from "$lib/components/ui/alert";
  import { Loader2, AlertCircle, CheckCircle2 } from "lucide-svelte";

  let url = $state("");
  let errorMsg = $state("");
  let successMsg = $state("");
  let isProcessing = $state(false);

  function isValidUrl(value: string): boolean {
    try {
      const parsedUrl = new URL(value);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function submitUrl(event: Event) {
    event.preventDefault();

    errorMsg = "";
    successMsg = "";

    const trimmedUrl = url.trim();

    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      errorMsg = "Please enter a valid HTTP or HTTPS URL.";
      return;
    }

    try {
      isProcessing = true;

      await sleep(2500);

      successMsg = "Done.";
      await sleep(1200);
      successMsg = "";
    } catch (error) {
      errorMsg = "An error occurred while processing the URL.";
    } finally {
      isProcessing = false;
    }
  }
</script>

<main class="min-h-screen grid place-items-center bg-background px-6">
  <Card.Root class="w-full max-w-xl">
    <Card.Header class="space-y-2 text-center">
      <Card.Title class="text-3xl font-semibold">Enter a URL</Card.Title>
      <Card.Description>
        Paste the URL you want to download from.
      </Card.Description>
    </Card.Header>

    <Card.Content>
      <form onsubmit={submitUrl} class="space-y-4">
        <div class="space-y-2">
          <Input
            type="url"
            bind:value={url}
            placeholder="https://youtube.com/watch?v=..."
            aria-invalid={errorMsg ? "true" : "false"}
            class={errorMsg
              ? "border-destructive focus-visible:ring-destructive/20"
              : ""}
            disabled={isProcessing}
          />
        </div>

        <Button type="submit" class="w-full" disabled={isProcessing}>
          {#if isProcessing}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Processing...
          {:else}
            Download
          {/if}
        </Button>
      </form>

      {#if errorMsg}
        <div class="mt-4">
          <Alert.Root variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <Alert.Title>Invalid URL</Alert.Title>
            <Alert.Description>{errorMsg}</Alert.Description>
          </Alert.Root>
        </div>
      {/if}

      {#if successMsg}
        <div class="mt-4">
          <Alert.Root>
            <CheckCircle2 class="h-4 w-4" />
            <Alert.Title>Success</Alert.Title>
            <Alert.Description>{successMsg}</Alert.Description>
          </Alert.Root>
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
</main>