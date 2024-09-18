<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import type { ProductVariant, ProductOption } from '../_utils/types';

  const {options, variants, title} = $props() as {options: ProductOption[], variants: ProductVariant[], title: string};

  const selectedOptions = writable<Record<string, string>>({});

  $effect(() => {
    const initialOptions = options.reduce((acc, option) => {
      acc[option.title] = option.values[0];
      return acc;
    }, {});
    selectedOptions.set(initialOptions);
  });

  const selectedVariant = derived(
    [selectedOptions],
    ([$selectedOptions]) => 
      variants.find(variant => 
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
    return !variants.some(variant => 
      Object.entries(testOptions).every(([key, value]) => variant.options[key] === value) &&
      variant.purchasable &&
      variant.inStock
    );
  }
</script>

<div>
  {#each options as option (option.id)}
    <fieldset>
      <legend>{option.title}</legend>
      {#each option.values as value}
        <div>
          <input 
            type="checkbox" 
            id={`${option.id}-${value}`}
            name={option.title}
            value={value}
            checked={$selectedOptions[option.title] === value}
            disabled={isOptionDisabled(option.title, value)}
            onchange={() => handleOptionChange(option.title, value)}
          />
          <label for={`${option.id}-${value}`}>{value}</label>
        </div>
      {/each}
    </fieldset>
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
  <p>Please select options to see available variants</p>
{/if}

<style>
  fieldset {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  legend {
    font-weight: bold;
  }
  input[type="checkbox"]:disabled + label {
    color: #999;
  }
  input[type="checkbox"]:disabled {
    opacity: 0.5;
  }
</style>