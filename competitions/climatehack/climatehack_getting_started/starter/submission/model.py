import torch
import torch.nn as nn

#########################################
#       Improve this basic model!       #
#########################################


class Model(nn.Module):
    def __init__(self):
        super().__init__()

        self.input_layer = nn.Linear(in_features=12 * 128 * 128, out_features=384)
        self.encoder_output_layer = nn.Linear(in_features=384, out_features=384)
        self.decoder_input_layer = nn.Linear(in_features=384, out_features=384)
        self.output_layer = nn.Linear(in_features=384, out_features=12 * 64 * 64)

    def forward(self, features):
        x = torch.relu(self.input_layer(features))
        x = torch.sigmoid(self.encoder_output_layer(x))
        x = torch.relu(self.decoder_input_layer(x))
        x = torch.sigmoid(self.output_layer(x))

        return x
