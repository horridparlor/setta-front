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

/// ––––– ADMIN –––––

/// ––––– USER –––––

// ––– Authenticate
@tag("auth")
@route("/user/authenticate")
namespace Authenticate {
  @post
  op authenticate(@body request: Credentials): {
    @statusCode statusCode: 200;
    @body body: AuthResponse;
  };
}

model Credentials {
  username: string;
  password: string;
}

model AuthResponse {
  authToken: string;
  userId: int32;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
}

// ––– Cards
@tag("cards")
@route("/user/cards")
namespace Cards {
  @get
  op listCards(): {
    @statusCode statusCode: 200;
    @body body: CardList;
  };
}

model CardList {
  countOfCards: int32;
  cards: Card[];
}

model Card {
  cardId: int32;
  ownerId: int32;

  @doc("generated images need to be stored as array to allow multiple generations for same card")
  image: Image[];

  prompt: string;
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

model Image {
  @doc("use this id in backend to identify the generated assets")
  id: int32;

  status: "accepted" | "generated" | "queued" | "error";
  generatedByUserId: int32;
  generatedAt: string;
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
  amount?: int32 | EffectsCount;
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

// ––– Expansions
@tag("expansions")
@route("/user/expansions")
namespace Expansions {
  @get
  op listExpansions(): {
    @statusCode statusCode: 200;
    @body body: ExpansionList;
  };
}

model ExpansionList {
  countOfExpansions: int32;
  expansions: Expansion[];
}

model Expansion {
  id: int32;
  ownedId: int32;
  name: string;
  releaseYear: int32;
  isReleased: boolean;
}

// ––– Users
@route("/user/users")
namespace Users {
  @get
  @tag("users_planned")
  op listUsers(): {
    @statusCode statusCode: 200;
    @body body: User[];
  } | {
    @statusCode statusCode: 401;
    @body error: Error;
  };

  @get
  @tag("users_planned")
  op getUser(@path userId: int32): {
    @statusCode statusCode: 200;
    @body body: User;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };

  @post
  @tag("users_planned")
  op createUser(@body create: UserCreate): {
    @statusCode statusCode: 201;
    @body body: User;
  };

  @patch
  @tag("users_planned")
  op updateUser(@path userId: int32, @body update: UserUpdate): {
    @statusCode statusCode: 200;
    @body body: User;
  };

  @delete
  @tag("users_planned")
  op deleteUser(@path userId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
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
  tokens: int32;
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
  tokens: int32;
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
  tokens?: int32;
}

// --- DECKS
@route("/decks")
namespace Decks {
  @get
  @tag("decks_planned")
  @doc("returns all decks user has access to")
  op listDecks(): {
    @statusCode statusCode: 200;
    @body body: DeckList;
  };

  @post
  @tag("decks_planned")
  op createDeck(@body create: DeckCreate): {
    @statusCode statusCode: 201;
    @body body: Deck;
  };

  @patch
  @tag("decks_planned")
  op updateDeck(@path userId: int32, @body update: DeckUpdate): {
    @statusCode statusCode: 200;
    @body body: Deck;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };

  @route("{deckId}/:copy")
  @post
  @tag("decks_planned")
  @doc("copies current deck with name '<deckname> (copy)'")
  op copyDeck(@path deckId: int32): {
    @statusCode statusCode: 201;
    @body body: Deck;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };
}

model DeckList {
  countOfDecks: int32;
  decks: Deck[];
}

model Deck {
  ownerId: int32;
  formatId: int32;
  name: string;
  released: boolean;
  releasedAt: string | null;
  cardsLinks: CardLink[];
}

model DeckCreate {
  name: string;
  released: boolean;
}

model DeckUpdate {
  name?: string;
  released?: boolean;
}

model Format {
  id: int32;
}

// --- CARD_LINKS

@route("/card_links")
namespace CardLinks {
  @post
  @tag("card_links_planned")
  @doc("add card to deck")
  op createCardLink(@body create: CardLink): {
    @statusCode statusCode: 201;
    @body body: CardLink;
  };

  @patch
  @tag("card_links_planned")
  @doc("update count of cards in deck")
  op updateCardLink(@body update: CardLink): {
    @statusCode statusCode: 201;
    @body body: CardLink;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };

  @delete
  @tag("card_links_planned")
  @doc("remove card from deck")
  op deleteCardLink(): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };
}

model CardLink {
  deckId: int32;
  cardId: int32;
  count: int32;
}

// --- ROLES

@route("/roles")
namespace Roles {
  @tag("roles_planned")
  @get
  op listRoles(): {
    @statusCode statusCode: 200;
    @body body: Role[];
  };

  @tag("roles_planned")
  @get
  op getRole(@path roleId: int32): {
    @statusCode statusCode: 200;
    @body body: Role;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
  };

  @tag("roles_planned")
  @post
  op createRole(@body create: RoleCreate): {
    @statusCode statusCode: 201;
    @body body: Role;
  };

  @tag("roles_planned")
  @post
  op updateRole(@path roleId: int32, @body update: RoleUpdate): {
    @statusCode statusCode: 200;
    @body body: Role;
  };

  @tag("roles_planned")
  @delete
  op deleteRole(@path roleId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
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
  @tag("token_requests_planned")
  @get
  op listTokenRequests(): {
    @statusCode statusCode: 200;
    @body body: TokenRequest[];
  };

  @tag("token_requests_planned")
  @post
  op requestTokens(): {
    @statusCode statusCode: 200;
    @body body: TokenRequest;
  };

  @tag("token_requests_planned")
  @delete
  op deleteTokenRequest(@path tokenRequestId: int32): {
    @statusCode statusCode: 204;
  } | {
    @statusCode statusCode: 404;
    @body error: Error;
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
model Error {
  error: string;
}
