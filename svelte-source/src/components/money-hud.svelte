<script lang="ts">
  import { faBuildingColumns, faWallet } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fly } from 'svelte/transition';
  import DebugStore from '../stores/debugStore';
  import MoneyHudStore from '../stores/moneyHudStore';

  $: debugPreview = DebugStore
    && !$MoneyHudStore.showCash
    && !$MoneyHudStore.showBank
    && !$MoneyHudStore.showUpdate;
  $: showCash = debugPreview || $MoneyHudStore.showCash;
  $: showBank = debugPreview || $MoneyHudStore.showBank;
  $: showUpdate = debugPreview || $MoneyHudStore.showUpdate;
  $: cash = debugPreview ? 2840 : $MoneyHudStore.cash;
  $: bank = debugPreview ? 48750 : $MoneyHudStore.bank;
  $: amount = debugPreview ? 1250 : $MoneyHudStore.amount;
  $: moneyType = debugPreview ? 'bank' : $MoneyHudStore.type;
  $: isMinus = !debugPreview && $MoneyHudStore.minus;
</script>

{#if showCash || showBank || showUpdate}
  <div class="money-container">
    {#if showCash}
      <div class="account-row cash" transition:fly|local="{{x: 18, duration: 220}}">
        <span class="account-icon"><Fa icon={faWallet} scale={0.7} /></span>
        <span class="account-label">CASH</span>
        <span class="account-value">{MoneyHudStore.formatMoney(cash)}</span>
      </div>
    {/if}

    {#if showBank}
      <div class="account-row bank" transition:fly|local="{{x: 18, duration: 220}}">
        <span class="account-icon"><Fa icon={faBuildingColumns} scale={0.68} /></span>
        <span class="account-label">BANK</span>
        <span class="account-value">{MoneyHudStore.formatMoney(bank)}</span>
      </div>
    {/if}

    {#if showUpdate}
      <div
        class="money-change"
        class:negative={isMinus}
        transition:fly|local="{{x: 18, duration: 220}}"
      >
        <span class="change-account">{moneyType}</span>
        <span class="change-value">
          {isMinus ? '-' : '+'}{MoneyHudStore.formatMoney(amount)}
        </span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .money-container {
    position: fixed;
    top: 7.8rem;
    right: 2.2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.42rem;
    width: 15rem;
    color: #ffffff;
    font-family: "Yantramanav", "Work Sans", Arial, sans-serif;
    pointer-events: none;
    text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.9), 0.08rem 0.08rem 0 rgba(0, 0, 0, 0.76);
  }

  .account-row {
    display: grid;
    grid-template-columns: 1.1rem 3.2rem minmax(0, 1fr);
    align-items: center;
    gap: 0.45rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0.18rem 0.65rem 0.18rem 0;
    border-right: 0.16rem solid currentColor;
    font-variant-numeric: tabular-nums;
  }

  .account-row.cash {
    color: #f0d53a;
  }

  .account-row.bank {
    color: #65caff;
  }

  .account-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .account-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.74rem;
    font-weight: 900;
    line-height: 1;
  }

  .account-value {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.94);
    font-size: 1.28rem;
    font-weight: 900;
    line-height: 1;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .money-change {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 0.55rem;
    box-sizing: border-box;
    width: 100%;
    padding-right: 0.8rem;
    color: #72d995;
    font-variant-numeric: tabular-nums;
  }

  .money-change.negative {
    color: #ec5b48;
  }

  .change-account {
    color: rgba(255, 255, 255, 0.42);
    font-size: 0.7rem;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .change-value {
    font-size: 1.05rem;
    font-weight: 900;
    line-height: 1;
  }

  @media (max-height: 800px) {
    .money-container {
      top: 6.25rem;
      right: 1.5rem;
      transform: scale(0.86);
      transform-origin: right top;
    }
  }

  @media (min-height: 1200px) {
    .money-container {
      top: 9.1rem;
      right: 2.6rem;
      transform: scale(1.18);
      transform-origin: right top;
    }
  }
</style>
