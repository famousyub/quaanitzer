package quanta.response;

import java.util.List;

import quanta.model.NodeInfo;
import quanta.response.base.ResponseBase;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RenderDocumentResponse extends ResponseBase {
	private List<NodeInfo> searchResults;
}
