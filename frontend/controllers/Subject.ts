import { ResourceDB } from "@/lib/types";
import Resource from "@/models/Resource";

export const list = () => {
    return Resource.find().exec();
}

export const get = (id: string) => {
    return Resource.findById(id).exec();
}

export const create = (resource: ResourceDB) => {
    return Resource.create(resource);
}

export const update = (id: string, resource: ResourceDB) => {
    return Resource.findByIdAndUpdate(id, resource).exec();
}
