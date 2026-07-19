<script lang="ts">
  import {
    faArrowLeft,
    faArrowRight,
    faGasPump,
    faLightbulb,
    faMeteor,
    faOilCan,
    faTachometerAltFast,
    faUserSlash,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import DebugStore from '../stores/debugStore';
  import VehicleHudStore from '../stores/vehicleHudStore';

  const rpmTicks: number[] = Array.from({ length: 34 }, (_, index) => index);
  const fuelBars: number[] = [5, 4, 3, 2, 1];

  function formatSpeed(speed: number): string {
    const roundedSpeed = Math.max(0, Math.round(speed || 0));
    return roundedSpeed < 1000 ? roundedSpeed.toString().padStart(3, '0') : roundedSpeed.toString();
  }

  $: speedText = formatSpeed($VehicleHudStore.speed);
  $: rpmPercent = Math.max(0, Math.min($VehicleHudStore.rpm || 0, 100));
  $: activeRpmTicks = Math.round((rpmPercent / 100) * rpmTicks.length);
  $: fuelLevel = Math.max(0, Math.min($VehicleHudStore.fuel || 0, 100));
  $: activeFuelBars = Math.ceil(fuelLevel / 20);
  $: indicatorState = $VehicleHudStore.indicatorLights || 0;
  $: leftIndicatorOn = indicatorState === 1 || indicatorState === 3;
  $: rightIndicatorOn = indicatorState === 2 || indicatorState === 3;
  $: engineWarning = $VehicleHudStore.engine <= 70 || !$VehicleHudStore.engineOn;
  $: engineDanger = $VehicleHudStore.engine <= 35;
  $: lightsActive = $VehicleHudStore.lightsOn || $VehicleHudStore.highbeamsOn;
</script>

{#if $VehicleHudStore.show || DebugStore}
  <div class="vehicle-hud" transition:fade|local="{{duration: 250}}">
    <div class="readout">
      <div class="speed-block">
        <div class="speed-value">{speedText}</div>
      </div>

      <div class="gear-block">
        <div class="gear-box">{$VehicleHudStore.gear}</div>
        <div class="speed-unit">{$VehicleHudStore.speedUnit}</div>
      </div>

      <div class="fuel-block">
        <span class="fuel-label">F</span>
        <div class="fuel-bars">
          {#each fuelBars as bar}
            <span
              class="fuel-bar"
              class:active={bar <= activeFuelBars}
              class:low={fuelLevel <= 20}
              class:warn={fuelLevel > 20 && fuelLevel <= 40}
            ></span>
          {/each}
        </div>
        <span class="fuel-icon"><Fa icon={faGasPump} scale={0.65} /></span>
        <span class="fuel-label">E</span>
      </div>
    </div>

    <div class="rpm-row" aria-hidden="true">
      {#each rpmTicks as tick}
        <span
          class="rpm-tick"
          class:active={$VehicleHudStore.engineOn && tick < activeRpmTicks}
          class:hot={tick >= Math.floor(rpmTicks.length * 0.78)}
        ></span>
      {/each}
    </div>

    <div class="status-row">
      <span class="status-icon indicator" class:active={leftIndicatorOn}>
        <Fa icon={faArrowLeft} scale={0.85} />
      </span>
      <span class="status-icon indicator" class:active={rightIndicatorOn}>
        <Fa icon={faArrowRight} scale={0.85} />
      </span>
      <span class="status-icon" class:warning={engineWarning} class:danger={engineDanger}>
        <Fa icon={faOilCan} scale={0.78} />
      </span>
      <span class="status-icon" class:warning={$VehicleHudStore.showSeatBelt}>
        <Fa icon={faUserSlash} scale={0.78} />
      </span>
      <span class="status-icon" class:active={lightsActive} class:highbeam={$VehicleHudStore.highbeamsOn}>
        <Fa icon={faLightbulb} scale={0.72} />
      </span>
      <span class="status-icon" class:active={$VehicleHudStore.cruise}>
        <Fa icon={faTachometerAltFast} scale={0.72} />
      </span>
      <span class="status-icon" class:boost={$VehicleHudStore.nitroActive}>
        <Fa icon={faMeteor} scale={0.72} />
      </span>
      {#if $VehicleHudStore.showAltitude}
        <span class="altitude">ALT {$VehicleHudStore.altitude}</span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .vehicle-hud {
    position: fixed;
    right: 2.2rem;
    bottom: 2.2rem;
    width: 25rem;
    height: 9.3rem;
    color: #ffffff;
    font-family: "Yantramanav", "Work Sans", Arial, sans-serif;
    pointer-events: none;
    text-shadow: 0 0 0.55rem rgba(0, 0, 0, 0.86), 0.08rem 0.08rem 0 rgba(0, 0, 0, 0.72);
  }

  .readout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 4.2rem 2.7rem;
    align-items: end;
    gap: 0.9rem;
    height: 5.8rem;
  }

  .speed-block {
    min-width: 0;
    text-align: right;
  }

  .speed-value {
    color: rgba(255, 255, 255, 0.38);
    font-size: 6.4rem;
    font-weight: 900;
    line-height: 0.78;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }

  .gear-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 0.28rem;
    margin-bottom: 0.35rem;
  }

  .gear-box {
    display: grid;
    place-items: center;
    width: 3.2rem;
    height: 3.2rem;
    border: 0.16rem solid rgba(134, 213, 255, 0.85);
    border-radius: 0.42rem;
    background: linear-gradient(180deg, rgba(18, 89, 130, 0.92), rgba(15, 47, 82, 0.88));
    box-shadow: inset 0 0 0.45rem rgba(255, 255, 255, 0.32), 0 0 0.55rem rgba(47, 177, 255, 0.45);
    color: #ffffff;
    font-size: 2.15rem;
    font-weight: 800;
    line-height: 1;
  }

  .speed-unit {
    font-size: 1.45rem;
    font-weight: 900;
    line-height: 1;
  }

  .fuel-block {
    display: grid;
    grid-template-columns: 0.55rem 1.55rem 0.8rem;
    grid-template-rows: 0.9rem 4.2rem 0.9rem;
    align-items: center;
    justify-items: center;
    column-gap: 0.25rem;
    margin-bottom: 0.2rem;
  }

  .fuel-label {
    grid-column: 3;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    font-weight: 800;
    line-height: 1;
  }

  .fuel-label:first-child {
    grid-row: 1;
    transform: translateY(0.55rem);
  }

  .fuel-label:last-child {
    grid-row: 3;
    transform: translateY(-0.55rem);
  }

  .fuel-bars {
    grid-row: 2;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.22rem;
    width: 1.55rem;
    height: 4.2rem;
  }

  .fuel-bar {
    display: block;
    width: 1.55rem;
    height: 0.54rem;
    border: 0.1rem solid rgba(232, 232, 188, 0.35);
    background: rgba(22, 26, 24, 0.42);
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.65);
  }

  .fuel-bar.active {
    border-color: rgba(251, 243, 89, 0.78);
    background: #f4df36;
    box-shadow: 0 0 0.35rem rgba(244, 223, 54, 0.55);
  }

  .fuel-bar.active.warn {
    border-color: rgba(255, 180, 44, 0.82);
    background: #f6a925;
  }

  .fuel-bar.active.low {
    border-color: rgba(255, 80, 58, 0.86);
    background: #f0503a;
  }

  .fuel-icon {
    grid-row: 2;
    grid-column: 3;
    color: #f4df36;
    filter: drop-shadow(0 0 0.25rem rgba(244, 223, 54, 0.6));
  }

  .rpm-row {
    display: flex;
    justify-content: flex-end;
    gap: 0.12rem;
    width: 100%;
    height: 1.75rem;
    margin-top: 0.2rem;
  }

  .rpm-tick {
    display: block;
    width: 0.43rem;
    height: 1.45rem;
    border: 0.08rem solid rgba(255, 255, 255, 0.26);
    border-radius: 0.22rem;
    background: rgba(16, 20, 22, 0.28);
  }

  .rpm-tick.active {
    border-color: rgba(247, 219, 65, 0.82);
    background: #f0d53a;
    box-shadow: 0 0 0.32rem rgba(240, 213, 58, 0.48);
  }

  .rpm-tick.active.hot {
    border-color: rgba(236, 80, 55, 0.84);
    background: #ec5037;
    box-shadow: 0 0 0.36rem rgba(236, 80, 55, 0.55);
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
    box-sizing: border-box;
    height: 1.35rem;
    margin-top: 0.28rem;
    transform: translateX(3rem);
    color: rgba(255, 255, 255, 0.26);
  }

  .status-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.1rem;
    height: 1.1rem;
    color: rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0 0 0.22rem rgba(0, 0, 0, 0.8));
  }

  .status-icon.indicator.active {
    color: #dadada;
  }

  .status-icon.warning {
    color: #f0d53a;
  }

  .status-icon.danger {
    color: #eb4d3b;
  }

  .status-icon.active {
    color: #ececec;
  }

  .status-icon.highbeam {
    color: #81d4ff;
  }

  .status-icon.boost {
    color: #ee633f;
  }

  .altitude {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.9rem;
    font-weight: 800;
    line-height: 1;
  }

  @media (max-height: 800px) {
    .vehicle-hud {
      right: 1.5rem;
      bottom: 1.45rem;
      transform: scale(0.86);
      transform-origin: right bottom;
    }
  }

  @media (min-height: 1200px) {
    .vehicle-hud {
      right: 2.6rem;
      bottom: 2.6rem;
      transform: scale(1.18);
      transform-origin: right bottom;
    }
  }
</style>
