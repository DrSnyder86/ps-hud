import { writable } from 'svelte/store'
import { capAmountToHundred } from '../types/types'

type vehicleStatusType = {
  cruise: boolean,
  engine: number,
  engineOn: boolean,
  fuelColor: string,
  gear: string,
  highbeamsOn: boolean,
  indicatorLights: number,
  altitude: number,
  fuel: number,
  lightsOn: boolean,
  nitroActive: boolean,
  rpm: number,
  speed: number,
  speedUnit: string,
  vehicleName: string,
  show: boolean,
  showVehicleName: boolean,
  showAltitude: boolean,
  showSeatBelt: boolean,
  seatbeltOn: boolean,
  showSquare: boolean,
  showSquareBorder: boolean,
  ShowCircle: boolean,
  showCircleBorder: boolean,
  seatbeltColor: string,
}

type vehicleHudUpdateMessageType = {
  show: boolean,
  isPaused: boolean,
  seatbelt: boolean,
  speed: number,
  fuel: number,
  altitude: number,
  showAltitude: boolean,
  showSeatbelt: boolean,
  showSquareB: boolean,
  showCircleB: boolean, 
  rpm: number,
  gear: string,
  engine: number,
  engineOn: boolean,
  indicatorLights: number,
  lightsOn: boolean,
  highbeamsOn: boolean,
  cruise: boolean,
  nitroActive: boolean,
  speedUnit: string,
  vehicleName: string,
}

type vehicleHudShowMessage = {
  show: boolean,
  seatbelt: boolean,
}


const store = () => {

  const vehicleStatusState: vehicleStatusType = {
    cruise: false,
    engine: 100,
    engineOn: false,
    fuelColor: "#FFFFFF",
    gear: "P",
    highbeamsOn: false,
    indicatorLights: 0,
    altitude: 0,
    fuel: 0,
    lightsOn: false,
    nitroActive: false,
    rpm: 0,
    speed: 0,
    speedUnit: "MPH",
    vehicleName: "",
    show: false,
    showVehicleName: false,
    showAltitude: false,
    showSeatBelt: false,
    seatbeltOn: false,
    showSquare: false,
    showSquareBorder: false,
    ShowCircle: false,
    showCircleBorder: false,
    seatbeltColor: "#e85b14",
  }

  const { subscribe, set, update } = writable(vehicleStatusState);
  let vehicleNameTimer: ReturnType<typeof setTimeout> | undefined;

  const methods = {
    receiveShowMessage(data: vehicleHudShowMessage) {
      update(state => {
        state.show = data.show;
        state.showSeatBelt = data.seatbelt;
        state.seatbeltOn = data.seatbelt;
        if (!data.show) {
          state.showVehicleName = false;
          if (vehicleNameTimer) clearTimeout(vehicleNameTimer);
        }
        return state;
      })
    },
    receiveUpdateMessage(data: vehicleHudUpdateMessageType) {
      let revealVehicleName = false;
      update(state => {
        revealVehicleName = data.show
          && Boolean(data.vehicleName)
          && (!state.show || state.vehicleName !== data.vehicleName);
        state.show = data.show;
        state.speed = data.speed;
        state.altitude = data.altitude;
        state.fuel = capAmountToHundred(data.fuel);
        state.rpm = capAmountToHundred(data.rpm ?? 0);
        state.gear = data.gear || "P";
        state.engine = capAmountToHundred(data.engine ?? 100);
        state.engineOn = data.engineOn ?? false;
        state.indicatorLights = data.indicatorLights ?? 0;
        state.lightsOn = data.lightsOn ?? false;
        state.highbeamsOn = data.highbeamsOn ?? false;
        state.cruise = data.cruise ?? false;
        state.nitroActive = data.nitroActive ?? false;
        state.speedUnit = data.speedUnit || "MPH";
        state.vehicleName = data.vehicleName || "";
        if (revealVehicleName) state.showVehicleName = true;
        state.showSeatBelt = data.showSeatbelt && !data.seatbelt;
        state.seatbeltOn = data.seatbelt;
        state.showAltitude = data.showAltitude;
        state.showSquareBorder = data.showSquareB;
        state.showCircleBorder = data.showCircleB;

        if (data.fuel <= 20) {
          state.fuelColor = "#ff0000";
        } else if (data.fuel <= 30) {
          state.fuelColor = "#dd6e14";
        } else {
          state.fuelColor = "#FFFFFF";
        }

        if (data.isPaused) {
          state.show = false;
        }

        return state;
      });

      if (revealVehicleName) {
        if (vehicleNameTimer) clearTimeout(vehicleNameTimer);
        vehicleNameTimer = setTimeout(() => {
          update(state => {
            state.showVehicleName = false;
            return state;
          });
        }, 4200);
      }
    }
  }

  return {
    subscribe,
    set,
    update,
    ...methods
  }
}

export default store();
