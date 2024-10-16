import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Setta Backend",
})
@server("https://example.com/api", "Server endpoint")
namespace SettaBackend;

// --------------- USERS
@route("/users")
namespace Users {
  @tag("planned")
  @get
  op listUsers(): {
    @statusCode statusCode: 200;
    @body users: User[];
  };

  @tag("planned")
  @get
  op getUser(@path userId: int32): {
    @statusCode statusCode: 200;
    @body role: User;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };

  @tag("planned")
  @post
  op createUser(@body create: UserCreate): {
    @statusCode statusCode: 201;
    @body user: User;
  };

  @tag("planned")
  @patch
  op updateUser(@path userId: int32, @body update: UserUpdate): {
    @statusCode statusCode: 200;
    @body user: User;
  };

  @tag("planned")
  @delete
  op deleteUser(@path userId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };
}

model User {
  id: int32;
  roleId: int32;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username?: string;
  penName?: string;
  active: boolean;
  tokenRequests: TokenRequest[];
}

model UserCreate {
  roleId: int32;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username?: string;
  password?: string;
  penName?: string;
  sendPasswordEmail?: boolean;
}

model UserUpdate {
  roleId?: int32;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  penName?: string;
  active?: boolean;
}

// --------------- ROLES

@route("/roles")
namespace Roles {
  @tag("planned")
  @get
  op listRoles(): {
    @statusCode statusCode: 200;
    @body roles: Role[];
  };

  @tag("planned")
  @get
  op getRole(@path roleId: int32): {
    @statusCode statusCode: 200;
    @body role: Role;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };

  @tag("planned")
  @post
  op createRole(@body create: RoleCreate): {
    @statusCode statusCode: 201;
    @body role: Role;
  };

  @tag("planned")
  @post
  op updateRole(@path roleId: int32, @body update: RoleUpdate): {
    @statusCode statusCode: 200;
    @body role: Role;
  };

  @tag("planned")
  @delete
  op deleteRole(@path roleId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };
}

model Role {
  id: int32;
  name: string;
  rights: right[];
  createdAt: string;
  updatedAt: string;
}

model RoleCreate {
  name: string;
  rights: right[];
}

model RoleUpdate {
  name?: string;
  rights?: right[];
}

enum right {
  right1: "right1",
  right2: "right2",
  right3: "right3",
}

// --------------- TOKEN REQUESTS

@route("/token_requests")
namespace TokenRequests {
  @tag("planned")
  @get
  op listTokenRequests(): {
    @statusCode statusCode: 200;
    @body tokenRequests: TokenRequest[];
  };

  @tag("planned")
  @delete
  op deleteTokenRequest(@path tokenRequestId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };
}

model TokenRequest {
  id: int32;
  userId: int32;
  createdAt: string;
  cardsInQueue: int32;
}

// --------------- ERRORS

@error
model NotFoundError {
  code: "NOT_FOUND";
  message: string;
}

@error
model ValidationError {
  code: "VALIDATION_ERROR";
  message: string;
  details: string[];
}

@error
model InternalServerError {
  code: "INTERNAL_SERVER_ERROR";
  message: string;
}
