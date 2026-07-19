import { writable } from 'svelte/store';

type moneyType = 'cash' | 'bank';

type moneyStatus = {
  cash: number,
  bank: number,
  amount: number,
  type: moneyType,
  plus: boolean,
  minus: boolean,
  showCash: boolean,
  showBank: boolean,
  showUpdate: boolean,
}

type moneyShowConstantMessage = {
  cash: number,
  bank: number,
}

type moneyUpdateMessage = {
  amount: number,
  bank: number,
  cash: number,
  minus: boolean,
  type: moneyType,
}

type moneyShowAccountsMessage = {
  type: moneyType,
  cash?: number,
  bank?: number,
}

const store = () => {
  const moneyStatusState: moneyStatus = {
    cash: 0,
    bank: 0,
    amount: 0,
    type: 'cash',
    plus: false,
    minus: false,
    showCash: false,
    showBank: false,
    showUpdate: false,
  };

  const { subscribe, set, update } = writable(moneyStatusState);
  let updateTimer: ReturnType<typeof setTimeout> | undefined;
  let cashTimer: ReturnType<typeof setTimeout> | undefined;
  let bankTimer: ReturnType<typeof setTimeout> | undefined;

  const methods = {
    finishShowingUpdate() {
      update(state => {
        state.showUpdate = false;
        return state;
      });
    },
    finishShowingMoney(type: moneyType) {
      update(state => {
        if (type === 'cash') {
          state.showCash = false;
        } else {
          state.showBank = false;
        }
        return state;
      });
    },
    formatMoney(value: number) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(Math.max(0, Number(value) || 0));
    },
    scheduleAccountHide(type: moneyType, duration: number) {
      if (type === 'cash') {
        if (cashTimer) clearTimeout(cashTimer);
        cashTimer = setTimeout(() => methods.finishShowingMoney('cash'), duration);
      } else {
        if (bankTimer) clearTimeout(bankTimer);
        bankTimer = setTimeout(() => methods.finishShowingMoney('bank'), duration);
      }
    },
    receiveShowConstantMessage(data: moneyShowConstantMessage) {
      if (cashTimer) clearTimeout(cashTimer);
      if (bankTimer) clearTimeout(bankTimer);

      update(state => {
        state.showCash = true;
        state.showBank = true;
        state.cash = data.cash;
        state.bank = data.bank;
        return state;
      });
    },
    receiveUpdateMessage(data: moneyUpdateMessage) {
      if (updateTimer) clearTimeout(updateTimer);

      update(state => {
        state.showUpdate = true;
        state.amount = Math.max(0, data.amount || 0);
        state.bank = data.bank;
        state.cash = data.cash;
        state.type = data.type;
        state.minus = data.minus;
        state.plus = !data.minus;

        if (data.type === 'cash') {
          state.showCash = true;
        } else {
          state.showBank = true;
        }

        return state;
      });

      updateTimer = setTimeout(() => methods.finishShowingUpdate(), 3000);
      methods.scheduleAccountHide(data.type, 4000);
    },
    receiveShowAccountsMessage(data: moneyShowAccountsMessage) {
      update(state => {
        if (data.type === 'cash') {
          state.showCash = true;
          state.cash = data.cash ?? state.cash;
        } else {
          state.showBank = true;
          state.bank = data.bank ?? state.bank;
        }
        return state;
      });

      methods.scheduleAccountHide(data.type, 3500);
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
