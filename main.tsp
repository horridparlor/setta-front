import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Sausage Factory Backend",
})
@server("https://example.com/api", "Server endpoint")
@useAuth(Http.BearerAuth)
namespace SausageFactoryBackend;
