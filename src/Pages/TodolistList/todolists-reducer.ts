import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, SetStatusAT} from "../../App/app-reducer";

const initialState: TodolistDomainType[] = []

export function todolistsReducer(state: TodolistDomainType[] = initialState, action: ActionType): TodolistDomainType[] {
    switch (action.type) {
        case "DELETE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "CREATE-TODOLIST":
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => (tl.id === action.id ? {...tl, title: action.title} : tl))
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => (tl.id === action.id ? {...tl, filter: action.filter} : tl))
        case "SET-TODOLIST":
            return action.todolist.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case "SET-ENTITY-STATUS":
            return state.map(tl => (tl.id === action.id ? {...tl, entityStatus: action.status} : tl))
        default:
            return state
    }
}

export const deleteTodolistAC = (id: string) =>
    ({type: "DELETE-TODOLIST", id} as const)
export const createTodolistAC = (todolist: TodolistType) =>
    ({type: "CREATE-TODOLIST", todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: "CHANGE-TODOLIST-TITLE", id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterType) =>
    ({type: "CHANGE-TODOLIST-FILTER", id, filter} as const)
export const setTodolistAC = (todolist: Array<TodolistType>) =>
    ({type: "SET-TODOLIST", todolist} as const)
export const setEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: "SET-ENTITY-STATUS", id, status} as const)

export const getTodolistTC = (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.getTodolist()
        .then(response => {
            dispatch(setTodolistAC(response.data))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setEntityStatusAC(todolistId, "loading"))
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.deleteTodolist(todolistId)
        .then((response) => {
            dispatch(deleteTodolistAC(todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.createTodolist(title)
        .then((response) => {
            dispatch(createTodolistAC(response.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const changerTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.updateTodolist(todolistId, title)
        .then(response => {
            dispatch(changeTodolistTitleAC(todolistId, title))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export type FilterType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

type ActionType =
    | DeleteTodolistType
    | CreateTodolistType
    | ChangeTodolistTitleType
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistType
    | SetStatusAT
    | setEntityStatusType

export type DeleteTodolistType = ReturnType<typeof deleteTodolistAC>
export type CreateTodolistType = ReturnType<typeof createTodolistAC>
export type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitleAC>
export type SetTodolistType = ReturnType<typeof setTodolistAC>
export type setEntityStatusType = ReturnType<typeof setEntityStatusAC>
