{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      php = pkgs.php84.buildEnv {
        extensions = ({ enabled, all }: enabled ++ (with all; [
          pdo
          pdo_pgsql
          pgsql
          mbstring
          tokenizer
          xml
          ctype
          bcmath
          curl
          fileinfo
          openssl
          intl
        ]));
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          just
          php
          php84Packages.composer
          nodejs
          nodePackages.pnpm
          postgresql
          openssl
        ];

        shellHook = ''
          echo "php      : $(php -v | head -n1)"
          echo "composer : $(composer -V | head -n1)"
          echo "node     : $(node -v)"
          echo "pnpm     : $(pnpm -v)"
        '';
      };
    };
}
