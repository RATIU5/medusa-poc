<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import type { ProcessedProduct, ProductVariant } from '../_utils/types'; // Import the types we defined earlier

  const {product} = $props() as {product: ProcessedProduct};

  const selectedOptions = writable<Record<string, string>>({});

  // Initialize selectedOptions with the first available option for each
  $effect(() => {
    const initialOptions = product.options.reduce((acc, option) => {
      acc[option.title] = option.values[0];
      return acc;
    }, {});
    selectedOptions.set(initialOptions);
  });

  const selectedVariant = derived(
    [selectedOptions],
    ([$selectedOptions]) => 
      product.variants.find(variant => 
        Object.entries($selectedOptions).every(
          ([key, value]) => variant.options[key] === value
        )
      )
  );

  function handleOptionChange(optionTitle: string, value: string) {
    selectedOptions.update(opts => ({ ...opts, [optionTitle]: value }));
  }

  function isOptionDisabled(optionTitle: string, optionValue: string): boolean {
    const testOptions = { ...$selectedOptions, [optionTitle]: optionValue };
    return !product.variants.some(variant => 
      Object.entries(testOptions).every(([key, value]) => variant.options[key] === value) &&
      variant.purchasable &&
      variant.inStock
    );
  }
</script>

<div>
  {#each product.options as option (option.id)}
    <div>
      <label for={option.id}>{option.title}</label>
      <select
        id={option.id}
        value={$selectedOptions[option.title]}
        on:change={(e) => handleOptionChange(option.title, e.target.value)}
      >
        {#each option.values as value}
          <option 
            value={value}
            disabled={isOptionDisabled(option.title, value)}
          >
            {value}
          </option>
        {/each}
      </select>
    </div>
  {/each}
</div>

{#if $selectedVariant}
  <p>Selected Variant: {$selectedVariant.title}</p>
  <p>SKU: {$selectedVariant.sku}</p>
  <p>Price: ${$selectedVariant.price.toFixed(2)}</p>
  <button 
    disabled={!$selectedVariant.purchasable || !$selectedVariant.inStock}
  >
    Add to Cart
  </button>
{:else}
  <p>No variant available for the selected options</p>
{/if}

<style>
  /* Add your styles here */
  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>