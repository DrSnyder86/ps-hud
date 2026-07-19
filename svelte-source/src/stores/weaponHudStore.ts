import { writable } from 'svelte/store';

type weaponHudState = {
  show: boolean,
  weaponName: string,
  clip: number,
  reserve: number,
  maxClip: number,
  reloading: boolean,
}

type weaponHudUpdateMessage = weaponHudState;

const store = () => {
  const initialState: weaponHudState = {
    show: false,
    weaponName: '',
    clip: 0,
    reserve: 0,
    maxClip: 0,
    reloading: false,
  };

  const { subscribe, set, update } = writable(initialState);

  const methods = {
    receiveUpdateMessage(data: weaponHudUpdateMessage) {
      update(state => {
        state.show = data.show;
        state.weaponName = data.weaponName || '';
        state.clip = Math.max(0, data.clip || 0);
        state.reserve = Math.max(0, data.reserve || 0);
        state.maxClip = Math.max(0, data.maxClip || 0);
        state.reloading = data.reloading ?? false;
        return state;
      });
    },
  };

  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};

export default store();
