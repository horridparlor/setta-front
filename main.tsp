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

// ––– Card
@route("admin/card")
namespace Card {
  @post
  op postCard(@body request: PostCardRequest): {
    @statusCode statusCode: 200;
    @body response: PostCardResponse;
  } | ErrorUnauthorized;
  @put
  op putCard(@body request: PutCardRequest): {
    @statusCode statusCode: 200;
    @body response: PutCardResponse;
  } | ErrorUnauthorized;
  @delete
  op deleteCard(@body request: DeleteCardRequest): {
    @statusCode statusCode: 200;
    @body response: DeleteCardResponse;
  } | ErrorUnauthorized;
}

model PostCardRequest {
  cardName: string;
  serializedName: string;
  isAce: boolean;
  cardClass: string;
  cardType: string;
  subtype: string;
  supertype: string;
  maximumPiece: string;
  level: int32;
  atk: int32;
  def: int32;
  primaryMaterialId: int32 | null;
  secondaryMaterialId: int32 | null;
  tertiaryMaterialId: int32 | null;
  materialsReminder: string;
  costText: string;
  effectText: string;
  flavourText: string;
  countsAsId: int32 | null;
  artScale: int32;
  artXOffset: int32;
  artYOffset: int32;
  nameSize: int32;
  materialsSize: int32;
  effectsSize: int32;
  expansionId: int32;
  cardEffects: CardEffects;
}

model PostCardResponse {
  cardId: int32;
}

model PutCardRequest {
  cardId: int32;
  cardName: string;
  serializedName: string;
  isAce: boolean;
  cardClass: string;
  cardType: string;
  subtype: string;
  supertype: string;
  maximumPiece: string;
  level: int32;
  atk: int32;
  def: int32;
  primaryMaterialId: int32 | null;
  secondaryMaterialId: int32 | null;
  tertiaryMaterialId: int32 | null;
  materialsReminder: string;
  costText: string;
  effectText: string;
  flavourText: string;
  countsAsId: int32 | null;
  artScale: int32;
  artXOffset: int32;
  artYOffset: int32;
  nameSize: int32;
  materialsSize: int32;
  effectsSize: int32;
  expansionId: int32;
  cardEffects: CardEffects;
}

model PutCardResponse {
  cardId: int32;
}

model DeleteCardRequest {
  cardId: int32;
}

model DeleteCardResponse {
  cardId: int32;
}

// ––– CopyCard
@route("admin/copy-card")
namespace CopyCard {
  @post
  op copyCard(@body request: CopyCardRequest): {
    @statusCode statusCode: 200;
    @body response: CopyCardResponse;
  } | ErrorUnauthorized;
}

model CopyCardRequest {
  cardId: int32;
  serializedName: string;
  doErrata: boolean;
}

model CopyCardResponse {
  cardId: int32;
}

// ––– Image
@route("admin/image")
namespace Image {
  @post
  op postImage(@body request: PostImageRequest): {
    @statusCode statusCode: 200;
    @body response: PostImageResponse;
  } | ErrorUnauthorized;
}

model PostImageRequest {
  cardId: int32;
  ownerId: int32;
  imageName: string;
  artScale: int32;
  artXOffset: int32;
  artYOffset: int32;
  base64String: string;
}

model PostImageResponse {
  imagePath: string;
}

// ––– User
@route("admin/user")
namespace User {
  @get
  op getUser(@body request: GetUserRequest): {
    @statusCode statusCode: 200;
    @body response: SystemUser;
  } | ErrorUnauthorized | ErrorNotFound;
  @post
  op postUser(@body request: PostUserRequest): {
    @statusCode statusCode: 200;
    @body response: PostUserResponse;
  } | ErrorUnauthorized;
  @put
  op putUser(@body request: PutUserRequest): {
    @statusCode statusCode: 200;
    @body response: PutUserResponse;
  } | ErrorUnauthorized;
  @delete
  op deleteUser(@body request: DeleteUserRequest): {
    @statusCode statusCode: 200;
    @body response: DeleteUserResponse;
  } | ErrorUnauthorized;
}

model SystemUser {
  id: int32;
  username: string;
  firstname: string;
  lastname: string;
  penName?: string;
  email?: string;
  phoneNumber?: string;
  isActive: boolean;
  roleId: int32;
  accessRights: AccessRights;
  tokenRequest?: UserTokenRequest;
}

model GetUserRequest {
  userId: int32;
}

model PostUserRequest {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  penName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleId?: int32;
  accessRights: AccessRights;
}

model PostUserResponse {
  userId: int32;
}

model PutUserRequest {
    userId: int32;
    username: string;
    firstname: string;
    lastname: string;
    penName?: string;
    email?: string;
    phoneNumber?: string;
    isActive?: boolean;
    roleId?: int32;
    accessRights: AccessRights;
}

model PutUserResponse {
    userId: int32;
}

model DeleteUserRequest {
    userId: int32;
    deleteAllTheirContent?: boolean;
}

model DeleteUserResponse {
    userId: int32;
}

// ––– Users
@route("admin/users")
namespace Users {
  @get
  op listUsers(): {
    @statusCode statusCode: 200;
    @body response: ListUsersResponse;
  } | ErrorUnauthorized;
}

model ListUsersResponse {
  countOfUsers: int32;
  users: SystemUser[];
}

// ––– ROLES

@route("admin/role")
namespace Role {
  @get
  op getRole(@body request: GetRoleRequest): {
    @statusCode statusCode: 200;
    @body response: UserRole;
  } | ErrorUnauthorized | ErrorNotFound;
  @post
  op postRole(@body request: PostRoleRequest): {
    @statusCode statusCode: 200;
    @body response: PostRoleResponse;
  } | ErrorUnauthorized;
  @put
  op putRole(@body request: PutRoleRequest): {
    @statusCode statusCode: 200;
    @body response: PutRoleResponse;
  } | ErrorUnauthorized;
  @delete
  op deleteRole(@body request: DeleteRoleRequest): {
    @statusCode statusCode: 200;
    @body response: DeleteRoleResponse;
  } | ErrorUnauthorized;
}

model GetRoleRequest {
    roleId: int32;
}

model PostRoleRequest {
    name: string;
    accessRights: AccessRights;
}

model PostRoleResponse {
    roleId: int32;
}

model PutRoleRequest {
    roleId: int32;
    name: string;
    accessRights: AccessRights;
}

model PutRoleResponse {
    roleId: int32;
}

model DeleteRoleRequest {
    roleId: int32;
}

model DeleteRoleResponse {
    roleId: int32;
}

@route("admin/roles")
namespace Roles {
  @get
  op listRoles(): {
    @statusCode statusCode: 200;
    @body response: ListRolesResponse;
  } | ErrorUnauthorized;
}

model ListRolesResponse {
    countOfRoles: int32;
    roles: UserRole[];
}

model UserRole {
  id: int32;
  name: string;
  accessRights: AccessRights;
  createdAt: string;
  updatedAt: string;
}

// ––– TOKEN REQUESTS

@route("admin/token-requests")
namespace TokenRequests {
  @get
  op listTokenRequests(): {
    @statusCode statusCode: 200;
    @body response: ListTokenRequestsResponse;
  } | ErrorUnauthorized;
}

model ListTokenRequestsResponse {
    countOfTokenRequests: int32;
    tokenRequests: UserTokenRequest[];
}

@route("admin/token-request")
namespace TokenRequest {
  @post
  op postTokenRequest(@body request: PostTokenRequestRequest): {
    @statusCode statusCode: 200;
    @body response: PostTokenRequestResponse;
  } | ErrorUnauthorized | ErrorForbidden;
  @delete
  op deleteTokenRequest(@body request: DeleteTokenRequestRequest): {
    @statusCode statusCode: 200;
    @body response: DeleteTokenRequestResponse;
  } | ErrorUnauthorized;
}

model PostTokenRequestRequest {
    userId?: int32,
}

model PostTokenRequestResponse {
    tokenRequestId: int32;
}

model DeleteTokenRequestRequest {
    userId?: int32,
}

model DeleteTokenRequestResponse {
    userId: int32;
}

model UserTokenRequest {
  id: int32;
  userId: int32;
  cardsInQueue: int32;
  createdAt: string;
}

/// ––––– USER –––––

// ––– Authenticate
@route("user/authenticate")
namespace Authenticate {
  @post
  op authenticate(@body request: AuthenticateRequest): {
    @statusCode statusCode: 200;
    @body response: AuthenticateResponse;
  } | ErrorUnauthorized;
}

model AuthenticateRequest {
  username: string;
  password: string;
}

model AuthenticateResponse {
  authToken: string;
  userId: int32;
  firstname: string;
  lastname: string;
  accessRights: AccessRights;
}

model AccessRights {
    isSuperAdmin?: boolean;
    canRelease?: boolean;
    canManageAdmins?: boolean;
    canManageUsers?: boolean;
    canClearContent?: boolean;
    hasUnlimitedTokens?: boolean;
    canShareTokens?: boolean;
    canMessageAdmins?: boolean;
    canMassExport?: boolean;
    canCreateContent?: boolean;
    canGenerateImages?: boolean;
    canMessage?: boolean;
    autoRefillTokens?: boolean;
    isRegularUser?: boolean;
    isPriorityUser?: boolean;
    isEmployee?: boolean;
    isContentCreator?: boolean;
}

// ––– Cards
@route("user/cards")
namespace Cards {
  @get
  op listCards(): {
    @statusCode statusCode: 200;
    @body response: ListCardsResponse;
  };
}

model ListCardsResponse {
  countOfCards: int32;
  cards: CardData[];
}

model CardData {
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

  // consider grouping other card tabs like this as well to clean up the api (stats, effects)
  art: Art;

  // multiple images can be generated for a single card
  images: CardImage[];
}

model CardEffects {
  cost: EffectsCost;
  effect: EffectsEffect;
}

model EffectsCost {
  prestate: string | null;
  costType: string;
  subtype: string | null;
  supertype: string | null;
  amount: int32 | null;
  target: EffectsTarget | null;
  payment: EffectsPayment | null;
  postCount: PostCount | null;
}

model EffectsTarget {
  cardType: string | null;
  cardClass: string | null;
  subtype: string | null;
  minLevel: int32 | null;
  maxLevel: int32 | null;
  atk: int32 | null;
  def: int32 | null;
  zone: string | null;
  targetType: string | null;
  owner: string | null;
}

model EffectsPayment {
  paymentType: string | null;
  amount: int32 | null;
  cardType: string | null;
}

model PostCount {
  countType: string;
  subtype: string | null;
}

model EffectsEffect {
  effectType: string;
  subtype: string | null;
  supertype: string | null;
  amount: int32 | EffectsCount | null;
  maxAmount: int32 | null;
  target: EffectsTarget | null;
  direction: string | null;
  hindrance: string | null;
  benefit: string | null;
  chainEffect: ChainEffect | null;
}

model EffectsCount {
  multiplier: int32;
  target: EffectsTarget | null;
}

model ChainEffect {
  chainType: string;
  subtype: string | null;
  direction: string | null;
  amount: int32 | null;
}

// ––– ChangePassword
@route("user/change-password")
namespace ChangePassword {
  @post
  op changePassword(@body request: ChangePasswordRequest): {
    @statusCode statusCode: 200;
    @body response: ChangePasswordResponse;
  } | ErrorUnauthorized;
}

model ChangePasswordRequest {
  password: string;
}

model ChangePasswordResponse {
  status: string;
}

// ––– Expansions
@route("user/expansions")
namespace Expansions {
  @get
  op listExpansions(): {
    @statusCode statusCode: 200;
    @body response: ListExpansionsResponse;
  };
}

model ListExpansionsResponse {
  countOfExpansions: int32;
  expansions: CardExpansion[];
}

model CardExpansion {
  id: int32;
  ownerId: int32;
  name: string;
  releaseYear: int32;
  isReleased: boolean;
}

// ––– ERRORS

@error
model ErrorNotFound {
  error: string;
}
@error
model ErrorUnauthorized {
  error: string;
}
@error
model ErrorForbidden {
  error: string;
}

// ––– TODO

model CardImage {
  @doc("use this id in backend to identify the generated assets")
  id: int32;

  status: "accepted" | "generated" | "queued" | "error";
  generatedByUserId: int32;
  generatedAt: string;

  // art/prompt used for generating this image
  art: Art;
}

model Art {
  prompt: string;
  manualPrompt: string;
  background: string;
  type: "monster" | "backrow" | "spell" | "trap";
  characters: Character[];
  specialEffects: string;
}

model Character {
  hidden: boolean;
  who: string;
  name: string;
  appearance: string;
  race: "none" | "human" | "animal" | "beastial" | "monster" | "abstract";
  gender: "none" | "undefined" | "female" | "male";
  age: "none" | "adult" | "teen" | "elderly" | "child";
  type: "main" | "supporting" | "antagonist" | "background";
  tool: string;
  action: string;
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

model Error {
  error: string;
}
