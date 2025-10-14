export class BaseInstrument {
    protected constructor() {}

    public connectedCallback(): void {}

    public Update(): void {}

    public getGameState(): GameState {
        return GameState.ingame;
    }
}

export function registerInstrument(id: string, Instrument: new() => BaseInstrument) {
    const instance = new Instrument();

    instance.connectedCallback();
    window.setInterval(() => instance.Update(), 50);
}

export enum RunwayDesignator {
    RUNWAY_DESIGNATOR_NONE,
    RUNWAY_DESIGNATOR_LEFT,
    RUNWAY_DESIGNATOR_RIGHT,
    RUNWAY_DESIGNATOR_CENTER,
    RUNWAY_DESIGNATOR_WATER,
    RUNWAY_DESIGNATOR_A,
    RUNWAY_DESIGNATOR_B,
}

export enum ApproachType {
    APPROACH_TYPE_UNKNOWN,
    APPROACH_TYPE_GPS,
    APPROACH_TYPE_VOR,
    APPROACH_TYPE_NDB,
    APPROACH_TYPE_ILS,
    APPROACH_TYPE_LOCALIZER,
    APPROACH_TYPE_SDF,
    APPROACH_TYPE_LDA,
    APPROACH_TYPE_VORDME,
    APPROACH_TYPE_NDBDME,
    APPROACH_TYPE_RNAV,
    APPROACH_TYPE_LOCALIZER_BACK_COURSE,
}

export enum GameState {
    mainmenu,
    loading,
    briefing,
    ingame,
}

export namespace Avionics {
    export class Utils {
        public DEG2RAD = Math.PI / 180;
    }
}

export function LaunchFlowEvent(event: string, key: string, bus: string, data: string) {
    console.log(event, key, bus, JSON.parse(data));
}
