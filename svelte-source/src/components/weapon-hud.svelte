<script lang="ts">
  import { faGun } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import DebugStore from '../stores/debugStore';
  import WeaponHudStore from '../stores/weaponHudStore';

  $: debugPreview = DebugStore && !$WeaponHudStore.show;
  $: weaponName = debugPreview ? 'CARBINE RIFLE' : $WeaponHudStore.weaponName;
  $: clip = debugPreview ? 24 : $WeaponHudStore.clip;
  $: reserve = debugPreview ? 168 : $WeaponHudStore.reserve;
  $: maxClip = debugPreview ? 30 : $WeaponHudStore.maxClip;
  $: reloading = !debugPreview && $WeaponHudStore.reloading;
  $: magazinePercent = maxClip > 0 ? Math.min(100, (clip / maxClip) * 100) : 0;
  $: lowAmmo = maxClip > 0 && clip <= Math.max(2, Math.ceil(maxClip * 0.2));
</script>

{#if $WeaponHudStore.show || DebugStore}
  <div class="weapon-hud" transition:fade|local="{{duration: 180}}">
    <div class="weapon-name">
      <Fa icon={faGun} scale={0.72} />
      <span>{weaponName}</span>
    </div>

    <div class="ammo-readout">
      <span class="clip" class:low={lowAmmo}>{clip}</span>
      <span class="divider">/</span>
      <span class="reserve">{reserve}</span>
    </div>

    <div class="magazine-track" class:low={lowAmmo}>
      <span style="width: {magazinePercent}%"></span>
    </div>

    {#if reloading}
      <span class="reloading">RELOADING</span>
    {/if}
  </div>
{/if}

<style>
  .weapon-hud {
    position: fixed;
    top: 2.2rem;
    right: 2.2rem;
    width: 13.5rem;
    box-sizing: border-box;
    padding-right: 0.75rem;
    border-right: 0.18rem solid #65caff;
    color: #ffffff;
    font-family: "Yantramanav", "Work Sans", Arial, sans-serif;
    text-align: right;
    text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.9), 0.08rem 0.08rem 0 rgba(0, 0, 0, 0.76);
    pointer-events: none;
  }

  .weapon-name {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
    min-width: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
  }

  .weapon-name span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ammo-readout {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 0.42rem;
    height: 2.65rem;
    margin-top: 0.12rem;
    font-variant-numeric: tabular-nums;
  }

  .clip {
    color: rgba(255, 255, 255, 0.96);
    font-size: 2.75rem;
    font-weight: 900;
    line-height: 1;
  }

  .clip.low {
    color: #f0d53a;
  }

  .divider {
    color: rgba(255, 255, 255, 0.28);
    font-size: 1.3rem;
    font-weight: 700;
  }

  .reserve {
    min-width: 2.5rem;
    color: rgba(255, 255, 255, 0.52);
    font-size: 1.35rem;
    font-weight: 800;
  }

  .magazine-track {
    position: relative;
    width: 100%;
    height: 0.16rem;
    margin-top: 0.25rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.18);
  }

  .magazine-track span {
    display: block;
    height: 100%;
    background: #65caff;
    box-shadow: 0 0 0.35rem rgba(101, 202, 255, 0.72);
    transition: width 120ms linear;
  }

  .magazine-track.low span {
    background: #f0d53a;
    box-shadow: 0 0 0.35rem rgba(240, 213, 58, 0.64);
  }

  .reloading {
    display: block;
    margin-top: 0.35rem;
    color: #65caff;
    font-size: 0.72rem;
    font-weight: 900;
    line-height: 1;
  }

  @media (max-height: 800px) {
    .weapon-hud {
      top: 1.5rem;
      right: 1.5rem;
      transform: scale(0.86);
      transform-origin: right top;
    }
  }

  @media (min-height: 1200px) {
    .weapon-hud {
      top: 2.6rem;
      right: 2.6rem;
      transform: scale(1.18);
      transform-origin: right top;
    }
  }
</style>
