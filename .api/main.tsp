import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Setta Backend",
})
@server("https://example.com/api", "Server endpoint")
@useAuth(Http.BearerAuth)
namespace SettaBackend;

// --- CARDS
@route("/user/cards")
namespace Cards {
    @get
    op listCards(): {
        @statusCode statusCode: 200;
        @body response: CardsResponse;
    };
}

model CardsResponse {
    countOfCards: int32;
    cards: Card[];
}

model Card {
    cardId: int32;
    ownerId: int32;
    errataOfId?: int32;
    ownerFirstname: string;
    ownerLastname: string;
    cardName: string;
    isAce: boolean;
    cardClass: string;
    cardType: string;
    subtype: string;
    supertype: string;
    maximumPiece: string;
    level: int32;
    atk: int32;
    def: int32;
    primaryMaterialId?: int32;
    secondaryMaterialId?: int32;
    tertiaryMaterialId?: int32;
    materialsReminder?: string;
    costText: string;
    effectText: string;
    flavourText: string;
    countsAsId?: int32;
    artScale: float32;
    artXOffset: float32;
    artYOffset: float32;
    nameSize: float32;
    materialsSize: float32;
    effectsSize: float32;
    expansionId: int32;
    originalExpansionId: int32;
    createdAt: string;
    updatedAt: string;
    cardEffects: CardEffects;
}

model CardEffects {
    cost: EffectsCost;
    effect: EffectsEffect;
}

model EffectsCost {
    prestate?: string;
    costType: string;
    subtype?: string;
    supertype?: string;
    amount?: int32;
    target?: EffectsTarget;
    payment?: EffectsPayment;
    postCount?: PostCount;
}

model EffectsTarget {
    cardType?: string;
    cardClass?: string;
    subtype?: string;
    minLevel?: int32;
    maxLevel?: int32;
    atk?: int32;
    def?: int32;
    zone?: string;
    targetType?: string;
    owner?: string;
}

model EffectsPayment {
    paymentType?: string;
    amount?: int32;
    cardType?: string;
}

model PostCount {
    countType: string;
    subtype?: string;
}

model EffectsEffect {
    effectType: string;
    subtype?: string;
    supertype?: string;
    amount?: int32|EffectsCount;
    maxAmount?: int32;
    target?: EffectsTarget;
    direction?: string;
    hindrance?: string;
    benefit?: string;
    chainEffect?: ChainEffect;
}

model EffectsCount {
    multiplier: int32;
    target?: EffectsTarget;
}

model ChainEffect {
    chainType: string;
    subtype?: string;
    direction?: string;
    amount?: int32;
}

// --- USERS
@route("/user/users")
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

// --- ROLES

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

// --- TOKEN REQUESTS

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

// --- ERRORS

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
