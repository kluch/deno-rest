import {
  Application,
  Router,
  RouteParams,
  Response,
  Request,
} from "https://deno.land/x/oak/mod.ts";
// import { Response } from "https://deno.land/x/oak/response.ts";
const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

let dogs = [
  {
    name: `Roger`,
    age: 8,
  },
  {
    name: `Sid`,
    age: 7,
  },
];

export const getDogs = ({ response }: { response: Response }): any =>
  response.body = dogs;

export const getDog = (
  { params, response }: { params: RouteParams; response: Response },
): any => {
  const dog = dogs.find((dog) =>
    dog.name.toLowerCase() === params.name?.toLowerCase()
  );
  if (dog) {
    response.status = 200;
    response.body = dog;
    return;
  }

  response.status = 400;
  response.body = {
    msg: `Cannot find dog ${params.name}`,
  };
};

export const addDog = async (
  { request, response }: { request: Request; response: Response },
): Promise<any> => {
  const body = await request.body();
  const dog = body.value;
  dogs.push(dog);

  response.body = {
    msg: `OK`,
  };
  response.status = 200;
};

export const updateDog = async (
  { params, request, response }: {
    params: RouteParams;
    request: Request;
    response: Response;
  },
): Promise<any> => {
  const temp = dogs.find((dog) =>
    dog.name.toLowerCase() === params.name?.toLowerCase()
  );
  const body = await request.body();
  const { age } = body.value;

  if (temp) {
    temp.age = age;
    response.status = 200;
    response.body = {
      msg: "OK",
    };

    return;
  }

  response.status = 400;
  response.body = {
    msg: `Cannot find dog ${params.name}`,
  };
};

export const removeDog = async (
  { params, request, response }: {
    params: RouteParams;
    request: Request;
    response: Response;
  },
): Promise<any> => {
  const lengthBefore = dogs.length;
  dogs = dogs.filter((dog) =>
    dog.name.toLowerCase() !== params.name?.toLowerCase()
  );

  if (dogs.length === lengthBefore) {
    response.status = 400;
    response.body = {
      msg: `Cannot find dog ${params.name}`,
    };
    return;
  }

  response.status = 200;
  response.body = {
    msg: "OK",
  };
};

const router = new Router();
router
  .get("/dogs", getDogs)
  .get("/dogs/:name", getDog)
  .post("/dogs", addDog)
  .put("/dogs/:name", updateDog)
  .delete("/dogs/:name", removeDog);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}`);

await app.listen(`${HOST}:${PORT}`);
