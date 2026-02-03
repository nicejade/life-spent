<script lang="ts">
  export let options: Array<any>
  export let active: number = 0
  export let label: string = ''
  export let listboxClass: string = 'w-36'

  import { createEventDispatcher } from 'svelte'
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Transition,
  } from '@rgossiaux/svelte-headlessui'
  import SvgIcon from './SvgIcon.svelte'
  import type { SelectItem } from '../types/main'
  import { deepClone } from '../helper/utils'

  const dispatch = createEventDispatcher()

  let selectedItem: SelectItem = options[active]
  let selectedItemCopy: SelectItem = deepClone(selectedItem)

  /* Make the selected item change according to the system language switch */
  const updateSelectedItem = () => {
    selectedItem = options.find((item) => item.value === selectedItem?.value)
  }

  $: if (options) {
    updateSelectedItem()
  }

  $: if (selectedItem?.name !== selectedItemCopy?.name) {
    selectedItemCopy = deepClone(selectedItem)
    dispatch('selected', selectedItem)
  }
</script>

<div class="flex items-center justify-center space-x-2 text-neutral-300 light:text-neutral-700">
  {#if label}
    <label for="custom-select" class="font-medium">{label}</label>
  {/if}
  <Listbox bind:value={selectedItem} let:open class={listboxClass}>
    <div class="relative">
      <ListboxButton
        class="focus-visible-ring relative h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-white/5 pl-3 pr-10 text-left hover:bg-white/10 hover:border-white/20 focus:outline-none sm:text-sm text-paper-50 light:bg-black/5 light:border-black/10 light:hover:bg-black/10 light:hover:border-black/20 light:text-ink-950">
        <span class="block truncate">{selectedItem.name}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <SvgIcon name="selector" width={20} height={20} />
        </span>
      </ListboxButton>

      {#if open}
        <Transition
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0">
          <ListboxOptions
            static
            style="z-index: 49"
            class="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-ink-900/95 backdrop-blur-glass py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm light:bg-paper-50/95 light:ring-black/10">
            {#each options as item (item.name)}
              <ListboxOption let:selected let:active value={item} disabled={item.disabled}>
                <li
                  class="relative select-none py-2 pl-10 pr-4
                  {item.disabled ? 'text-neutral-500 cursor-not-allowed light:text-neutral-400' : 'cursor-pointer'}
                  {active ? 'text-paper-100 bg-white/10 light:text-ink-950 light:bg-black/10' : 'text-neutral-300 light:text-neutral-700'}">
                  <span
                    class="{selected ? 'text-paper-50 font-medium light:text-ink-950' : 'font-normal'} block truncate">
                    {item.name}
                  </span>
                  {#if selected}
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-paper-100 light:text-ink-950">
                      <SvgIcon name="check" color="currentColor" />
                    </span>
                  {/if}
                </li>
              </ListboxOption>
            {/each}
          </ListboxOptions>
        </Transition>
      {/if}
    </div>
  </Listbox>
</div>
